import React, { useEffect } from 'react';
import { Modal, Animated, useWindowDimensions } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import {
  container,
  Content,
  DraggableArea,
  MinimizeIcon,
  ModalWrapper,
  ScrollView,
} from './ContentsModal.styles';

const ContentsModal = ({ children }) => {
  const { height } = useWindowDimensions();
  const translateY = new Animated.Value(height);

  useEffect(() => {
    Animated.spring(
      translateY, {
        toValue: 0,
        velocity: 3,
        tension: 2,
        friction: 8,
        useNativeDriver: true,
      },
    ).start();
  }, []);

  const animatedEvent = Animated.event([{
    nativeEvent: { translationY: translateY },
  }], { useNativeDriver: true });

  const onHandlerStateChanged = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      let opened = true;
      const { translationY } = event.nativeEvent;

      if (translationY >= 100) opened = false;

      Animated.timing(translateY, {
        toValue: opened ? 0 : height,
        duration: 200,
        useNativeDriver: true,
      }).start(() => !opened && null);
    }
  };

  return (
    <ModalWrapper>
      <Modal>
        <Animated.View
          height={height}
          style={[container, {
            transform: [{
              translateY: translateY.interpolate({
                inputRange: [10, height],
                outputRange: [10, height],
                extrapolate: 'clamp',
              }),
            }],
          }]}
        >
          <ScrollView
            overScrollMode='never'
            showsVerticalScrollIndicator={false}
          >
            <PanGestureHandler
              onGestureEvent={animatedEvent}
              onHandlerStateChange={onHandlerStateChanged}
            >
              <DraggableArea><MinimizeIcon /></DraggableArea>
            </PanGestureHandler>
            <Content>{children}</Content>
          </ScrollView>
        </Animated.View>
      </Modal>
    </ModalWrapper>
  );
};

export default ContentsModal;