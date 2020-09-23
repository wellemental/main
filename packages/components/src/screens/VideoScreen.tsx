import React, { useRef, useState } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { H1 } from 'native-base';
import {
  Container,
  Button,
  Paragraph,
  AvyName,
  Spinner,
  Favorite,
  Box,
  Error,
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const deviceWidth = Dimensions.get('window').width;
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
  const { content, savedVideoPath } = route.params;
  const [error, setError] = useState();

  return (
    <View style={{ backgroundColor: '#000' }}>
      <View style={{ height: deviceHeight, width: deviceWidth }}>
        <Video
          source={{
            uri: savedVideoPath ? savedVideoPath : content.video,
          }} // Can be a URL or a local file.
          // ref={(ref) => {
          //   setVideoRef(ref);
          // }}
          fullscreenAutorotate={false}
          fullscreenOrientation={content.video_orientation}
          controls={true}
          playInBackground={true}
          ignoreSilentSwitch="ignore"
          // resizeMode="cover"
          // paused={true}
          onLoad={() => <Spinner />}
          onBuffer={() => <Spinner />}
          onError={setError}
          style={styles.backgroundVideo}
        />
      </View>
      <Error error={error} />
    </View>
  );
};

export default VideoScreen;
