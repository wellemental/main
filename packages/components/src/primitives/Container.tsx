import { NativeBase } from 'native-base';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import variables from '../assets/native-base-theme/variables/wellemental';

type ContainerProps = {
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
  scrollEnabled?: boolean;
};

const Container: React.FC<ContainerProps & NativeBase.Content> = ({
  style,
  scrollEnabled = false,
  children,
  color,
  center,
  noPadding,
  ...props
}) => {
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
  const container = scrollEnabled ? (
    <ScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles}
      children={children}
      style={{
        backgroundColor: color ? color : variables.containerBgColor,
        flex: 1,
      }}
    />
  ) : (
    <View style={[{ flex: 1 }, styles]} children={children} />
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: color ? color : variables.containerBgColor,
        flex: 1,
      }}>
      {container}
    </SafeAreaView>
  );
};

export default Container;
