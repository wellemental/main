import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import VideoPlayer from 'react-native-video-controls';
import Orientation from 'react-native-orientation-locker';
import { deviceWidth, deviceHeight } from 'services';

const videoHeight = deviceWidth * 0.56;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    height: videoHeight,
    width: deviceWidth,
  },
  nativeVideoControls: {
    top: 0,
    height: videoHeight,
    width: deviceWidth,
  },
  videoPoster: {
    height: videoHeight,
    width: deviceWidth,
    justifyContent: 'center',
    top: 0,
    position: 'absolute',
    backgroundColor: 'white',
  },
  fullscreen: {
    height: deviceWidth / 2,
    width: deviceHeight,
    // flex: 1,
    // display: 'flex',
  },
});

const VideoAndroid: React.FC = (props) => {
  const [isFullscreen, toggleFullscreen] = useState(false);
  console.log('IS FULL', isFullscreen);

  const handleOrientation = (orientation: string) => {
    console.log('ORIANTATION', orientation);
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      console.log('LANDSCAPE');
      if (!isFullscreen) {
        toggleFullscreen(true);
        StatusBar.setHidden(true);
      }
    } else {
      if (isFullscreen) {
        toggleFullscreen(false);
        StatusBar.setHidden(false);
      }
    }
  };

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);
    Orientation.unlockAllOrientations();
    console.log('LISTENING');
    return () => {
      // This would be inside componentWillUnmount()
      console.log('REMOVE LISTENING');
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  const videoStyles = isFullscreen
    ? styles.fullscreen
    : styles.nativeVideoControls;

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        flex: 1,
        paddingTop: 20,
      }}>
      <VideoPlayer
        controls={false}
        style={videoStyles}
        playInBackground={true}
        ignoreSilentSwitch="ignore"
        resizeMode="contain"
        toggleResizeModeOnFullscreen={false}
        // onEnterFullscreen={enterFullscreen}
        // onExitFullscreen={exitFullscreen}
        disableVolume={true}
        // disableBack={true}
        disableFullscreen={true}
        {...props}
      />
    </SafeAreaView>
  );
};

export default VideoAndroid;
