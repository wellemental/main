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

const deviceHeight = Dimensions.get('window').height - 100;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: deviceHeight,
    width: deviceWidth,
  },
});

const VideoScreen: React.FC<Props> = ({ navigation, route }) => {
  const { content, teacher } = route.params;
  const player = useRef();

  if (player.current !== undefined) {
    player.current.presentFullscreenPlayer();
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const [videoRef, setVideoRef] = useState();

  const onBuffer = () => {
    setLoading(true);
  };

  const onLoad = (payload) => {
    if (videoRef) {
      console.log('PAYLOAD', payload);
      videoRef.presentFullscreenPlayer();
    }
  };

  return (
    <View>
      <View style={{ height: deviceHeight, width: deviceWidth }}>
        {loading ? (
          <Spinner />
        ) : (
          <Video
            source={{
              uri: content.video,
            }} // Can be a URL or a local file.
            ref={(ref) => {
              setVideoRef(ref);
            }}
            fullscreenAutorotate={false}
            fullscreenOrientation={content.video_orientation}
            playInBackground={true}
            controls={true}
            resizeMode="cover"
            paused={true}
            // onReadyForDisplay={onLoad}
            // onBuffer={onBuffer} // Callback when remote video is buffering
            onError={setError}
            style={styles.backgroundVideo}
          />
        )}
      </View>
      <Error error={error} />
      {/* <Image
        source={{ uri: content.thumbnail }}
        style={{ height: 200, width: null, flex: 1 }}
      /> */}
      {/* <Box row justifyContent="space-between" gt={2} gb={1}>
        <H1>{content.title}</H1>
        <Favorite onProfile contentId={content.id} />
      </Box> */}

      {/* <Paragraph gb>
        {content.type.toUpperCase()} | {content.length}
      </Paragraph>

      <Paragraph gb>{content.description}</Paragraph> */}

      {/* <Button
        transparent
        onPress={() =>
          navigation.navigate('Teacher', {
            teacher,
          })
        }>
        <AvyName source={teacher.photo} name={content.teacher} onProfile />
      </Button> */}
    </View>
  );
};

export default VideoScreen;
