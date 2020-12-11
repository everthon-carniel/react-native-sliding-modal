# React Native Sliding Modal

This library provides a sliding and customizable modal responsive to panoramic gestures, using the [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/) library.
All animations produced by this component use React Native's [Animated](https://reactnative.dev/docs/animated) library.
The sliding-modal is also compatible with the [React Navigation](https://reactnavigation.org/docs/getting-started) library components, then it won't be necessary to create a stack to open it in [full-screen](https://reactnavigation.org/docs/modal), since it is rendered in an upper layer of the application.

- **Note**: To control the sliding-modal's properties types, the [PropTypes](https://www.npmjs.com/package/prop-types) library was used.

## Installation

- To install the library and its dependencies run: `npm install --save react-native-gesture-handler prop-types react-native-sliding-modal`

- If you are using React Native 0.59 or lower, you will need to run: `react-native link react-native-gesture-handler`. Since version 0.60, library link commands happen automatically.

## Example

```jsx
import React, { useState } from 'react';
import SlidingModal from 'react-native-sliding-modal';

const ExemplaryModal = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <SlidingModal
      isVisible={visible}
      handleVisible={setVisible}
    >
      {children}
    </SlidingModal>
  );
};

export default ExemplaryModal; 
```

- **Note**: To control the sliding-modal visibility correctly, it will be necessary to create a state and assign it to the `isVisible` property. This same state must have a handler function that will be assigned to the `handleVisible` property.

## Props

- **`backgroundColor`** _(String)_ - Sets the container background color.
- **`borderRadius`** _(Number)_ - Sets the container border radius.
- **`containerType`** _(String)_ - Defines which scroll container will be used, only identifies `ScrollView` or `FlatList` as parameter.
- **`customIcon`** _(Element)_ - Receives a component to replace the standard minimize icon.
- **`direction`** _(String)_ - Defines which direction the sliding-modal should expand when it opens. Only identifies `top-to-bottom` or `bottom-to-top` as parameter.
- **`handleVisible`** _(Func)_ - Receives a function to change the same state passed to the "isVisible" property. This function will set the state to false when the modal is closed by the swipeable area.
- **`isVisible`** _(Bool)_ - Sets the sliding-modal visibility. It must receive an external state.
- **`minimizeBorderRadius`** _(Number)_ - Sets the default icon border radius. It will be ignored if `customIcon` property exists.
- **`minimizeColor`** _(String)_ - Sets the default icon color. It will be ignored if `customIcon` property exists.
- **`minimizeHeight`** _(Number)_ - Sets the default icon height. It will be ignored if `customIcon` property exists.
- **`minimizeWidth`** _(Number)_ - Sets the default icon width. It will be ignored if `customIcon` property exists.
- **`onClose`** _(Func)_ - Receives a function to be called on sliding-modal close.
- **`style`** _(Object)_ - Assign additional styles to the container.
- **`swipeableColor`** _(String)_ - Sets the swipeable area background color.
- **`swipeableSize`** _(Number)_ - Sets the swipeable area height.

- **Note**: in addition to these properties you can also use all the native props from [ScrollView](https://reactnative.dev/docs/scrollview) and [FlatList](https://reactnative.dev/docs/flatlist), except these properties: `contentContainerStyle`, `inverted`, `overScrollMode` and `showsVerticalScrollIndicator`. 