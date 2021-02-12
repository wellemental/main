import React, { CSSProperties } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Platform,
} from 'react-native';
import ScrollView from './ScrollView';
import variables from '../assets/native-base-theme/variables/wellemental';

type ContainerProps = {
  style?: CSSProperties;
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
  scrollEnabled?: boolean;
};

const Container: React.FC<ContainerProps> = ({
  style,
  scrollEnabled = false,
  children,
  color,
  center,
  noPadding,
  ...props
}) => {
  const bgColor = color ? color : variables.containerBgColor;

  const styles = StyleSheet.flatten([
    {
      backgroundColor: bgColor,
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
      alignContent: center ? 'center' : undefined,
    },
    style,
  ]);
  const container = scrollEnabled ? (
    <ScrollView {...props} color={bgColor} children={children} />
  ) : (
    <View style={[{ flex: 1 }, styles]} children={children} />
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: color ? color : variables.containerBgColor,
        flex: 1,
        paddingTop: 0,
      }}>
      {container}
    </SafeAreaView>
  );
};

export default Container;
