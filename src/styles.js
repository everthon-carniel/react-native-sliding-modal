import { Animated } from 'react-native';
import styled from 'styled-components';

export const container = {
  borderTopLeftRadius: scale(20),
  borderTopRightRadius: scale(20),
  bottom: 0,
  elevation: 20,
  position: 'absolute',
  width: '100%',
};

export const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 },
})`
  border-top-left-radius: ${scale(20)}px;
  border-top-right-radius: ${scale(20)}px;
`;

export const DraggableArea = styled(Animated.View)`
  height: ${scale(40)}px;
  align-items: center;
`;

export const MinimizeIcon = styled.View`
  border-radius: 50px;
  height: ${scale(4)}px;
  width: 100px;
  background-color: white;
  margin-top: ${scale(15)}px;
`;

export const Content = styled.View`
  background-color: white;
  flex: 1;
`;

export const ModalWrapper = styled.View`
  flex: 1;
  background-color: red;
`;