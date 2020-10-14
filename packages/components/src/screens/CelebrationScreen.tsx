import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { H1 } from 'native-base';
import { Button, Box, Container } from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { useNavigation, useCurrentUser } from '../hooks';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';
import { deviceWidth } from 'services';

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
    backgroundColor: brandColors.skyBlue,
  },
});

// const styles = StyleSheet.create({
//   backgroundVideo: {
//     // position: 'absolute',
//     height: deviceHeight,
//     width: deviceWidth,
//   },
//   nativeVideoControls: {
//     top: 0,
//     height: '100%',
//     width: deviceWidth,
//   },

// });

const CelebrationScreen: React.FC<Props> = () => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();
  const [showPoster, togglePoster] = useState(true);
  const localVideo = require('../assets/images/celebration_screen.mp4');

  const onLoad = (data) => {
    togglePoster(false);
  };

  return (
    <View
      style={{
        backgroundColor: brandColors.skyBlue,
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
        <H1
          style={{
            color: brandColors.brandSecondary,
            fontSize: 60,
            height: 60,
            lineHeight: 70,
            marginBottom: 30,
          }}>
          {translation['You did it!']}
        </H1>

        <Button
          text={translation['Keep going']}
          onPress={() => navigation.navigate('Home')}
        />
      </Box>
    </View>
  );
};

export default CelebrationScreen;
