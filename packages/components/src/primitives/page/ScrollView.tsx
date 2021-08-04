import React, { CSSProperties } from 'react';
import { ScrollView as ScrollViewOg, StyleSheet } from 'react-native';
import variables from '../../assets/native-base-theme/variables/wellemental';

type ContainerProps = {
  style?: CSSProperties;
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
};

const ScrollView: React.FC<ContainerProps> = React.forwardRef((props, ref) => {
  const {
    style,
    children,
    color,
    center,
    noPadding,
    ...rest
  } = props;

  const styles = StyleSheet.flatten([
    {
      backgroundColor: color ? color : variables.containerBgColor,
      paddingHorizontal:
        noPadding === 'horizontal' || noPadding === 'none'
          ? 0
          : variables.mainContentPaddingHorizontal,
      paddingVertical:
        noPadding === 'vertical' || noPadding === 'none'
          ? 0
          : variables.mainContentPaddingVertical,
      justifyContent: center ? 'center' : undefined,
      alignItems: center ? 'center' : undefined,
      alignContent: 'center',
    },
    style,
  ]);

  return (
    <ScrollViewOg
      {...rest}
      showsVerticalScrollIndicator={false}
      ref={ref}
      contentContainerStyle={styles}
      children={children}
      style={{
        flex: 1,
        backgroundColor: color ? color : variables.containerBgColor,
      }}
    />
  );
});

export default ScrollView;
