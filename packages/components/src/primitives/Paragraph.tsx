import React from 'react';
import { NativeBase } from 'native-base';
import {
  StyleSheet,
  RecursiveArray,
  TextStyle,
  RegisteredStyle,
  Text,
} from 'react-native';

interface Props {
  style?: RecursiveArray<false | TextStyle | RegisteredStyle<TextStyle>>;
}

const Paragraph: React.FC<Props & NativeBase.Text> = ({ style, ...props }) => (
  <Text {...props} style={StyleSheet.flatten([style])} />
);

export default Paragraph;
