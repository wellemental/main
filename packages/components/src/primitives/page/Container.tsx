import React, { CSSProperties } from 'react';
import { SafeAreaView, StyleSheet, View, ImageBackground } from 'react-native';
import ScrollView from './ScrollView';
import ConditionalWrapper from '../utils/ConditionalWrapper';
import variables from '../../assets/native-base-theme/variables/wellemental';
import { deviceWidth } from 'services';

type ContainerProps = {
  style?: CSSProperties;
  noPadding?: 'vertical' | 'horizontal' | 'none';
  color?: string;
  center?: boolean;
  scrollEnabled?: boolean;
  bg?: keyof typeof backgrounds;
};

const backgrounds = {
  Morning: require('../../assets/images/wm_bg_morning.jpg'),
  Afternoon: require('../../assets/images/wm_bg_afternoon.jpg'),
  Evening: require('../../assets/images/wm_bg_evening.jpg'),
  Night: require('../../assets/images/wm_bg_evening.jpg'),
  Sleep: require('../../assets/images/wm_bg_sleep.jpg'),
  Move: require('../../assets/images/wm_bg_move.jpg'),
  Learn: require('../../assets/images/wm_bg_meditate.jpg'),
  Meditate: require('../../assets/images/wm_bg_sky.jpg'),
  Plans: require('../../assets/images/wm_bg_sky.jpg'),
  Profile: require('../../assets/images/wm_bg_tree.jpg'),
  Parents: require('../../assets/images/parents_bg.png'),
  AskParents: require('../../assets/images/parents_bg.png'),
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
  const lowOpacity = bg === 'Learn' || bg === 'Move';

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
    // <View
    //   style={{
    //     flex: 1,
    //     width: deviceWidth,
    //     // height: deviceHeight,
    //   }}>
    <ConditionalWrapper
      condition={bg}
      wrapper={(children: React.ReactChildren) => (
        <ImageBackground
          source={backgrounds[bg]}
          style={{
            width: deviceWidth,
            // height: deviceHeight,
            flex: 1,
          }}>
          {children}
        </ImageBackground>
      )}>
      <SafeAreaView
        style={{
          backgroundColor: color || bg ? bgColor : variables.containerBgColor,
          flex: 1,
          // paddingTop: 0,
        }}>
        {container}
      </SafeAreaView>
    </ConditionalWrapper>
    // </View>
  );
};

export default Container;
