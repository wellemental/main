import { NativeBase } from 'native-base';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import variables from '../assets/native-base-theme/variables/platform';

type ContentProps = {
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
};

const Content: React.FC<ContentProps & NativeBase.Content> = ({
  style,
  scrollEnabled = true,
  children,
  color,
  center,
  noPadding,
  ...props
}) => {
  const styles = StyleSheet.flatten([
    {
      backgroundColor: variables.containerBgColor,
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
    },
    style,
  ]);
  const container = scrollEnabled ? (
    <ScrollView
      {...props}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles}
      children={children}
      style={{ backgroundColor: variables.containerBgColor }}
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

export default Content;
