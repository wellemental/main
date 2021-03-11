import React from 'react';
import { NativeBase } from 'native-base';
import {
  StyleSheet,
  RecursiveArray,
  TextStyle,
  RegisteredStyle,
  Text,
} from 'react-native';
import { Colors } from 'common';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

export interface ParagraphProps {
  style?: RecursiveArray<false | TextStyle | RegisteredStyle<TextStyle>>;
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
  center?: boolean;
  fine?: boolean;
  bold?: boolean;
  color?: Colors;
}

const Paragraph: React.FC<ParagraphProps & NativeBase.Text> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
  center,
  color,
  fine,
  bold,
  ...props
}) => {
  const spacing = 15;
  const styles2 = StyleSheet.flatten([
    {
      fontSize: size ? size : 16,
      lineHeight: 22,
      paddingTop: gv ? spacing * gv : gt ? spacing * gt : 0,
      paddingBottom: gv ? spacing * gv : gb ? spacing * gb : 0,
      color: color
        ? brandColors[color]
        : fine
        ? brandColors.lightTextColor
        : brandColors.textColor,
      textAlign: center ? 'center' : undefined,
      alignSelf: center ? 'center' : 'flex-start',
      fontWeight: bold ? '900' : undefined,
    },
    style,
  ]);

  return (
    <Text style={styles2} {...props}>
      {children}
    </Text>
  );
};

export default Paragraph;
