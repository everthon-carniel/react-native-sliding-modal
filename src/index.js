import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Animated,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

const SlidingModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
  const topToBottom = props.direction === 'top-to-bottom';
  const height = topToBottom ? -windowHeight : windowHeight;
  const translateY = useRef(new Animated.Value(height)).current;
  const range = topToBottom ? [height, 0] : [0, height];

  const {
    containerType,
    customIcon,
    handleVisible,
    isVisible,
    onClose,
    style,
    children,                  // ScrollView
    ListHeaderComponent,       // FlatList
    ListHeaderComponentStyle,  // FlatList
    ListFooterComponent,       // FlatList
    ListFooterComponentStyle,  // FlatList
  } = props;

  const removeProps = (object, props) => {
    props.map(prop => delete object[prop]);
  };

  const flatListProps = {...props};

  removeProps(flatListProps, [
    'ListHeaderComponentStyle',
    'ListHeaderComponent',
    'ListFooterComponentStyle',
    'ListFooterComponent',
    'style',
    'inverted',
    'children',
    'backgroundColor',
    'direction',
    'contentContainerStyle',
    'overScrollMode',
    'showsVerticalScrollIndicator',
    'ref',
  ]);

  const scrollViewProps = {...props};

  removeProps(scrollViewProps, [
    'style',
    'backgroundColor',
    'direction',
    'contentContainerStyle',
    'overScrollMode',
    'showsVerticalScrollIndicator',
    'ref',
  ]);
  
  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      Animated.spring(
        translateY, {
          toValue: 0,
          velocity: 3,
          tension: 2,
          friction: 8,
          useNativeDriver: true,
        },
      ).start();
    } else {
      Animated.timing(
        translateY, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        },
      ).start(() => {
        onClose();
        setShowModal(false);
      });
    }
  }, [isVisible]);

  const animatedEvent = Animated.event([{
    nativeEvent: { translationY: translateY },
  }], { useNativeDriver: true });

  const onHandlerStateChanged = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = true;
      const { translationY } = event.nativeEvent;

      if (topToBottom ? translationY <= -150 : translationY >= 150) opened = false;

      Animated.timing(translateY, {
        toValue: opened ? 0 : height,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        if (!opened) {
          handleVisible(false);
          onClose();
          setShowModal(false);
        }
      });
    }
  };

  const SwipeableArea = (
    <PanGestureHandler
      onGestureEvent={animatedEvent}
      onHandlerStateChange={onHandlerStateChanged}
    >
      <Animated.View style={styles(props).swipeableArea}>
        {customIcon || <View style={styles(props).minimizeIcon} />}
      </Animated.View>
    </PanGestureHandler>
  );

  const ScrollViewComponent = () => {
    const Content = <View style={styles(props).content}>{children}</View>;

    return (
      <SafeAreaView
        onLayout={topToBottom && (() => scrollView.scrollToEnd())}
      >
        <ScrollView
          {...scrollViewProps}
          ref={ref => { scrollView = ref }}
          contentContainerStyle={styles(props).scrollView}
          overScrollMode='never'
          showsVerticalScrollIndicator={false}
        >
          {topToBottom
            ? <>{Content}{SwipeableArea}</>
            : <>{SwipeableArea}{Content}</>
          }
        </ScrollView>
      </SafeAreaView>
    );
  };

  const FlatListComponent = () => {
    const header = (
      <>
        {!topToBottom && SwipeableArea}
        <View style={ListHeaderComponentStyle}>
          {ListHeaderComponent}
        </View>
      </>
    );

    const footer = (
      <>
        <View style={ListFooterComponentStyle}>
          {ListFooterComponent}
        </View>
        {topToBottom && SwipeableArea}
      </>
    );

    return (
      <SafeAreaView
        onLayout={topToBottom && (() => flatList.scrollToEnd())}
        style={styles(props).flatListContainer}
      >
        <FlatList
          {...flatListProps}
          ref={ref => { flatList = ref }}
          contentContainerStyle={styles(props).flatList}
          ListFooterComponent={footer}
          ListFooterComponentStyle={styles(props).flatListFooter}
          ListHeaderComponent={header}
          overScrollMode='never'
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  };

  return (
    <Modal transparent visible={showModal}>
      <Animated.View style={{
        style,
        transform: [{
          translateY: translateY.interpolate({
            inputRange: range,
            outputRange: range,
            extrapolate: 'clamp',
          }),
        }]
      }}>
        <GestureHandlerRootView>
          {containerType === 'ScrollView'
            ? <ScrollViewComponent />
            : <FlatListComponent />
          }
        </GestureHandlerRootView>
      </Animated.View>
    </Modal>
  );
};

const styles = ({
  backgroundColor,
  borderRadius,
  direction,
  minimizeBorderRadius,
  minimizeColor,
  minimizeHeight,
  minimizeWidth,
  swipeableColor,
  swipeableSize,
}) => {
  const radius = direction === 'top-to-bottom'
    ? {
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    }
    : {
      borderTopLeftRadius:  borderRadius,
      borderTopRightRadius: borderRadius,
    };

  return StyleSheet.create({
    content: {
      flexGrow: 1,
    },
    swipeableArea: {
      ...radius,
      alignItems: 'center',
      backgroundColor: swipeableColor,
      height: swipeableSize,
      justifyContent: 'center',
    },
    minimizeIcon: {
      backgroundColor: minimizeColor,
      borderRadius: minimizeBorderRadius,
      height: minimizeHeight,
      width: minimizeWidth,
    },
    scrollView: {
      ...radius,
      backgroundColor: backgroundColor,
      flexGrow: 1,
      minHeight: '100%',
    },
    flatList: {
      ...radius,
      backgroundColor: backgroundColor,
      flexGrow: 1,
    },
    flatListContainer: {
      minHeight: '100%',
    },
    flatListFooter: {
      marginTop: 'auto',
    },
  });
}

SlidingModal.propTypes = {
  backgroundColor: PropTypes.string,
  borderRadius: PropTypes.number,
  containerType: PropTypes.string,
  customIcon: PropTypes.element,
  direction: PropTypes.string,
  handleVisible: PropTypes.func,
  isVisible: PropTypes.bool,
  minimizeBorderRadius: PropTypes.number,
  minimizeColor: PropTypes.string,
  minimizeHeight: PropTypes.number,
  minimizeWidth: PropTypes.number,
  onClose: PropTypes.func,
  style: PropTypes.object,
  swipeableColor: PropTypes.string,
  swipeableSize: PropTypes.number,
  ListHeaderComponentStyle: PropTypes.object, // FlatList
  ListFooterComponentStyle: PropTypes.object, // FlatList
}

SlidingModal.defaultProps = {
  backgroundColor: 'white',
  borderRadius: 0,
  containerType: 'ScrollView',
  customIcon: undefined,
  direction: 'bottom-to-top',
  handleVisible: () => {},
  isVisible: false,
  minimizeBorderRadius: 50,
  minimizeColor: 'white',
  minimizeHeight: 4,
  minimizeWidth: 100,
  onClose: () => {},
  style: {},
  swipeableColor: 'black',
  swipeableSize: 35,
  ListHeaderComponentStyle: {},
  ListFooterComponentStyle: {},
}

export default SlidingModal;