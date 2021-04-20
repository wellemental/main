import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Error, VideoAndroid } from '../primitives';
import { VideoScreenNavigationProp, VideoScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { deviceWidth } from 'services';

type Props = {
  route: VideoScreenRouteProp;
  navigation: VideoScreenNavigationProp;
};

const deviceHeight = deviceWidth * 1.78;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: deviceHeight,
    width: deviceWidth,
  },
});

const VideoScreen: React.FC<Props> = ({ route, navigation }) => {
  const { content, savedVideoPath, handleComplete } = route.params;
  const [error, setError] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.seconds);
  const [isOver, toggleOver] = useState(false);
  // Reference for video player to run methods from
  const player = useRef();

  if (!isOver && currentTime >= duration - 1) {
    toggleOver(true);
  }

  useEffect(() => {
    if (isOver) {
      if (!!player.current) {
        console.log('DISMISSES FULLSCREEN******');
        player.current.dismissFullscreenPlayer();
      }

      handleComplete();
    }
  }, [isOver]);

  const onProgress = data => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = data => {
    setDuration(data.duration);
  };

  return Platform.OS === 'android' ? (
    <VideoAndroid
      ref={ref => (player.current = ref)}
      source={{
        uri: savedVideoPath ? savedVideoPath : content.video,
      }}
      // onProgress={onProgress}
      // onLoad={onLoad}
      // onError={setError}
      onEnd={handleComplete}
      onBack={navigation.goBack}
      style={{ marginTop: 20 }}
    />
  ) : (
    <View style={{ backgroundColor: '#000' }}>
      <View style={{ height: deviceHeight, width: deviceWidth }}>
        <Video
          source={{
            uri: savedVideoPath ? savedVideoPath : content.video,
          }} // Can be a URL or a local file.
          fullscreenAutorotate={false}
          fullscreenOrientation={content.video_orientation}
          controls={true}
          playInBackground={true}
          ignoreSilentSwitch="ignore"
          // resizeMode="cover"
          // paused={true}
          onProgress={onProgress}
          onLoad={onLoad}
          onError={setError}
          style={styles.backgroundVideo}
        />
      </View>
      <Error error={error} />
    </View>
  );
};

export default VideoScreen;
