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
  gb?: boolean;
  gt?: boolean;
  gv?: boolean;
}

const Paragraph: React.FC<Props & NativeBase.Text> = ({
  style,
  children,
  gt,
  gb,
  gv,
}) => {
  const styles2 = StyleSheet.flatten([
    {
      fontSize: 16,
      lineHeight: 22,
      marginTop: gt || gv ? 15 : 0,
      marginBottom: gb || gv ? 15 : 0,
    },
    style,
  ]);

  return <Text style={styles2}>{children}</Text>;
};

export default Paragraph;
