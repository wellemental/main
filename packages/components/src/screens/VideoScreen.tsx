import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Error } from '../primitives';
import { VideoScreenNavigationProp, VideoScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { useNavigation } from '../hooks';
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

const VideoScreen: React.FC<Props> = ({ route }) => {
  const { content, savedVideoPath, handleComplete } = route.params;
  const [error, setError] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.seconds);
  const [isOver, toggleOver] = useState(false);

  if (!isOver && currentTime >= duration - 1) {
    toggleOver(true);
  }

  useEffect(() => {
    if (isOver) {
      handleComplete();
    }
  }, [isOver]);

  const onProgress = (data) => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  return (
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
