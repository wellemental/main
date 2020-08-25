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

const Paragraph: React.FC<Props & NativeBase.Text> = ({
  style,
  children,
  ...props
}) => {
  const styles = StyleSheet.flatten([{ fontSize: 16 }, style]);

  return (
    <Text {...props} style={styles}>
      {children}
    </Text>
  );
};

export default Paragraph;
