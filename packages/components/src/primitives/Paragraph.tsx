import React from 'react';
import { NativeBase } from 'native-base';
import {
  StyleSheet,
  RecursiveArray,
  TextStyle,
  RegisteredStyle,
  Text,
} from 'react-native';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

export interface ParagraphProps {
  style?: RecursiveArray<false | TextStyle | RegisteredStyle<TextStyle>>;
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
  center?: boolean;
}

const Paragraph: React.FC<ParagraphProps & NativeBase.Text> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
  center,
}) => {
  const spacing = 15;
  const styles2 = StyleSheet.flatten([
    {
      fontSize: size ? size : 16,
      lineHeight: 22,
      paddingTop: gv ? spacing * gv : gt ? spacing * gt : 0,
      paddingBottom: gv ? spacing * gv : gb ? spacing * gb : 0,
      color: brandColors.textColor,
      textAlign: center ? 'center' : 'left',
    },
    style,
  ]);

  return <Text style={styles2}>{children}</Text>;
};

export default Paragraph;
