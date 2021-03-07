import React, { CSSProperties } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ImageBackground,
  Platform,
} from 'react-native';
import ScrollView from './ScrollView';
import variables from '../assets/native-base-theme/variables/wellemental';
import { deviceHeight, deviceWidth } from 'services';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

type ContainerProps = {
  style?: CSSProperties;
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
  scrollEnabled?: boolean;
  bg?: keyof typeof backgrounds;
};

const backgrounds = {
  morning: require('../assets/images/wm_header_morning.jpg'),
  afternoon: require('../assets/images/wm_header_afternoon.jpg'),
  night: require('../assets/images/wm_bg_sleep.jpg'),
  sleep: require('../assets/images/wm_bg_sleep.jpg'),
  move: require('../assets/images/wm_bg_move.jpg'),
  learn: require('../assets/images/wm_bg_learn.jpg'),
  meditate: require('../assets/images/wm_bg_sleep.jpg'),
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
  const bgColor = 'rgba(0, 0, 0, 0)';

  const styles = StyleSheet.flatten([
    {
      backgroundColor: brandColors.skyBlue,
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
    <View
      style={{
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: brandColors.skyBlue,
      }}>
      <ImageBackground
        source={backgrounds.afternoon}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          flex: 1,
        }}>
        <SafeAreaView
          style={{
            backgroundColor: color ? color : variables.containerBgColor,
            flex: 1,
            paddingTop: 0,
          }}>
          {container}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default Container;
