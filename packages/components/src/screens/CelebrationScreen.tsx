import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Button, Box, Headline } from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { useNavigation, useCurrentUser } from '../hooks';
import { colors } from 'common';
import { deviceWidth, rateApp } from 'services';
import Orientation from 'react-native-orientation-locker';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const deviceHeight = deviceWidth * 1.78;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: deviceHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'stretch',
    bottom: 0,
    right: 0,
  },
  videoPoster: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    flex: 1,
    top: 0,
    position: 'absolute',
    backgroundColor: colors.skyBlue,
  },
});

const CelebrationScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { translation, user } = useCurrentUser();
  const [showPoster, togglePoster] = useState(true);
  const localVideo = require('../assets/images/celebration_screen.mp4');

  const onLoad = data => {
    togglePoster(false);
  };

  useEffect(() => {
    // Safeguard to lock to portrait after fullscreen flexibility
    Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (
      user.totalCompleted === 5 ||
      user.totalCompleted === 10 ||
      user.totalCompleted === 15
    ) {
      rateApp();
    }
  }, [showPoster]);

  return (
    <View
      style={{
        backgroundColor: colors.skyBlue,
        justifyContent: 'center',
        alignContent: 'center',
        flex: 1,
        padding: 20,
      }}>
      <Video
        source={localVideo}
        playInBackground={true}
        ignoreSilentSwitch="ignore"
        resizeMode="cover"
        style={styles.backgroundVideo}
        onLoad={onLoad}
      />
      {showPoster && (
        <Image
          source={require('../assets/images/celebration_bg.png')}
          style={styles.videoPoster}
        />
      )}
      <Box center>
        <Headline
          center
          style={{
            color: colors.secondary,
            fontSize: 60,
            height: 60,
            lineHeight: 70,
            marginBottom: 30,
          }}>
          {translation['You did it!']}
        </Headline>

        <Button
          text={translation['Keep going']}
          // onPress={() => navigation.navigate('Home')}
          onPress={() => navigation.goBack()}
        />
      </Box>
    </View>
  );
};

export default CelebrationScreen;
