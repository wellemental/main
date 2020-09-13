import React from 'react';
import { NativeBase } from 'native-base';
import {
  StyleSheet,
  RecursiveArray,
  TextStyle,
  RegisteredStyle,
  Text,
} from 'react-native';
import variables from '../assets/native-base-theme/variables/wellemental';

export interface ParagraphProps {
  style?: RecursiveArray<false | TextStyle | RegisteredStyle<TextStyle>>;
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
}

const Paragraph: React.FC<ParagraphProps & NativeBase.Text> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
}) => {
  const spacing = 15;
  const styles2 = StyleSheet.flatten([
    {
      fontSize: size ? size : 16,
      lineHeight: 22,
      paddingTop: gv ? spacing * gv : gt ? spacing * gt : 0,
      paddingBottom: gv ? spacing * gv : gb ? spacing * gb : 0,
      color: variables.textColor,
    },
    style,
  ]);

  return <Text style={styles2}>{children}</Text>;
};

export default Paragraph;
