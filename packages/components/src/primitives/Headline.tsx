import React from 'react';
import { StyleSheet, TextStyle, TextProps } from 'react-native';
import { H1, H3 } from 'native-base';

export interface HeadlineProps extends TextProps {
  style?: TextStyle;
  center?: boolean;
  small?: boolean;
}

const Headline: React.FC<HeadlineProps> = ({
  center = false,
  small = false,
  style,
  children,
  ...props
}) => {
  const Head = small ? H3 : H1;

  return (
    <Head
      style={StyleSheet.flatten([
        {
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
