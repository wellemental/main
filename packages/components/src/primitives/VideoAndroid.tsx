import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
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
    height: deviceHeight,
    width: deviceWidth,
  },
});

const VideoAndroid: React.FC = (props) => {
  const [isFullscreen, toggleFullscreen] = useState(false);
  console.log('IS FULL', isFullscreen);

  console.log('ENTERING');
  const enterFullscreen = () => {
    console.log('ENTERING');
    toggleFullscreen(true);
    Orientation.unlockAllOrientations();
  };

  const exitFullscreen = () => {
    console.log('EXITING');
    toggleFullscreen(false);
    Orientation.lockToLandscapeLeft();
  };

  const handleFullscreen = () => {
    isFullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft();
  };

  //   useEffect(() => {
  //     handleFullscreen();
  //   }, [isFullscreen]);

  const handleOrientation = (orientation: string) => {
    console.log('ORIANTATION', orientation);
    if (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') {
      console.log('LANDSCAPE');
      toggleFullscreen(true);
      StatusBar.setHidden(true);
    } else {
      toggleFullscreen(false);
      StatusBar.setHidden(false);
    }
  };

  useEffect(() => {
    // This would be inside componentDidMount()
    Orientation.addOrientationListener(handleOrientation);
    console.log('LISTENING');
    return () => {
      // This would be inside componentWillUnmount()
      console.log('REMOVE LISTENING');
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, []);

  return (
    <VideoPlayer
      controls={false}
      style={isFullscreen ? styles.nativeVideoControls : styles.fullscreen}
      playInBackground={true}
      ignoreSilentSwitch="ignore"
      //   resizeMode="cover"
      toggleResizeModeOnFullscreen={false}
      onEnterFullscreen={enterFullscreen}
      onExitFullscreen={exitFullscreen}
      disableVolume={true}
      disableBack={true}
      {...props}
    />
  );
};

export default VideoAndroid;
