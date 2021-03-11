import React from 'react';
import { StyleSheet, TextStyle, TextProps } from 'react-native';
import { H1, H3 } from 'native-base';
import { Colors } from 'common';
import variables from '../assets/native-base-theme/variables/wellemental';

export interface HeadlineProps extends TextProps {
  style?: TextStyle;
  center?: boolean;
  small?: boolean;
  color?: Colors;
}

const Headline: React.FC<HeadlineProps> = ({
  center = false,
  small = false,
  style,
  color,
  children,
  ...props
}) => {
  const Head = small ? H3 : H1;

  return (
    <Head
      style={StyleSheet.flatten([
        {
          color: color ? variables[color] : variables.brandPrimary,
          alignSelf: center ? 'center' : 'flex-start',
          textAlign: center ? 'center' : 'left',
        },
        style,
      ])}
      {...props}>
      {children}
    </Head>
  );
};

export default Headline;
