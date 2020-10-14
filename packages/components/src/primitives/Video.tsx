import React, { useState } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { H1 } from 'native-base';
import { Button } from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import FadeIn from 'react-native-fade-in-image';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const deviceWidth = Dimensions.get('window').width - 30;
const deviceHeight = deviceWidth * 0.56;

const styles = StyleSheet.create({
  backgroundVideo: {
    height: deviceHeight,
    width: deviceWidth,
  },
  nativeVideoControls: {
    top: 0,
    height: '100%',
    width: deviceWidth,
  },
  videoPoster: {
    height: deviceHeight,
    width: deviceWidth,
    justifyContent: 'center',
    flex: 1,
    top: 0,
    position: 'absolute',
    backgroundColor: 'white',
  },
});

const Video: React.FC<Props> = ({ navigation, route }) => {
  const { content, teacher } = route.params;
  const [video, setVideo] = useState(content.video);
  const [videoRef, setVideoRef] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.seconds);
  const [isBuffering, setBuffering] = useState(false);
  const [showPoster, togglePoster] = useState(true);
  const [error, setError] = useState();
  const [isVideoOver, setVideoOver] = useState(false);

  if (showPoster && currentTime > 0) {
    togglePoster(false);
  }

  if (!isVideoOver && currentTime >= duration - 1) {
    setVideoOver(true);
  }

  const handleError = (err: any) => {
    setError(err);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setBuffering(isBuffering);
  };

  return (
    <View style={{ width: deviceWidth, height: deviceHeight }}>
      <RNVideo
        source={{
          uri: content.video, //content.video,
        }} // Can be a URL or a local file.
        ref={(ref) => {
          setVideoRef(ref);
        }}
        style={styles.nativeVideoControls}
        // fullscreen
        // fullscreenAutorotate={true}
        // fullscreenOrientation={content.video_orientation}
        controls={true}
        playInBackground={true}
        ignoreSilentSwitch="ignore"
        resizeMode="cover"
        paused={false}
        poster={content.thumbnail}
        posterResizeMode="cover"
        onBuffer={onBuffer}
        onProgress={onProgress}
        onLoad={onLoad}
        onError={handleError} // Callback when video cannot be loaded
      />
      {showPoster && (
        <FadeIn style={styles.videoPoster}>
          <Image
            source={{ uri: content.thumbnail }}
            style={styles.videoPoster}
          />
        </FadeIn>
      )}
      {showPoster && (
        <FadeIn style={styles.videoPoster}>
          <Image
            source={{ uri: content.thumbnail }}
            style={styles.videoPoster}
          />
        </FadeIn>
      )}
    </View>
  );
};

export default Video;
