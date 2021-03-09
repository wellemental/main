import React, { CSSProperties } from 'react';
import { SafeAreaView, StyleSheet, View, ImageBackground } from 'react-native';
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
  Morning: require('../assets/images/wm_header_morning.jpg'),
  Afternoon: require('../assets/images/wm_header_afternoon.jpg'),
  Night: require('../assets/images/wm_bg_sleep.jpg'),
  Sleep: require('../assets/images/wm_bg_sleep.jpg'),
  Move: require('../assets/images/wm_bg_move.jpg'),
  Learn: require('../assets/images/wm_bg_learn.jpg'),
  Meditate: require('../assets/images/wm_bg_meditate.jpg'),
  Plans: require('../assets/images/cloud_bg.png'),
  Parents: require('../assets/images/parents_bg.png'),
};

const Container: React.FC<ContainerProps> = ({
  style,
  scrollEnabled = false,
  children,
  color,
  center,
  bg,
  noPadding,
  ...props
}) => {
  const bgColor = 'rgba(0, 0, 0, 0)';

  const styles = StyleSheet.flatten([
    {
      backgroundColor: 'rgba(0, 0, 0, 0)',
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
      }}>
      <ImageBackground
        source={backgrounds[bg]}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          flex: 1,
        }}>
        <SafeAreaView
          style={{
            backgroundColor: bg ? bgColor : variables.containerBgColor,
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
