import React, { useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { H1, Button as NBButton, Icon } from 'native-base';
import {
  AvyName,
  Box,
  Button,
  Container,
  Download,
  Favorite,
  Paragraph,
  Spinner,
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { DownloadVideoService } from 'services';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const deviceWidth = Dimensions.get('window').width - 30;
const deviceHeight = deviceWidth * 0.56;

const styles = StyleSheet.create({
  backgroundVideo: {
    // position: 'absolute',
    height: deviceHeight,
    width: deviceWidth,
  },
});

const ContentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { content, teacher } = route.params;
  const [video, setVideo] = useState(content.video);
  const [videoRef, setVideoRef] = useState();

  const [error, setError] = useState();

  const service = new DownloadVideoService();

  useEffect(() => {
    const handleGetVideo = async () => {
      const newVideo = await service.getVideo(video);
      console.log('THIS BE RUNNING', newVideo);
      setVideo(newVideo);
    };

    handleGetVideo();
  }, []);

  const handleError = (err: any) => {
    console.log('ERROR', err);
    setError(err);
  };

  return (
    <Container>
      {content.video_orientation === 'portrait' ? (
        <View style={{ width: deviceWidth, height: deviceHeight }}>
          <ImageBackground
            source={{ uri: content.thumbnail }}
            style={{
              height: deviceHeight,
              width: deviceWidth,
              justifyContent: 'center',
              flex: 1,
            }}>
            <NBButton
              onPress={() =>
                navigation.navigate('Video', {
                  content,
                  teacher,
                  savedVideoPath: video,
                })
              }
              style={{
                backgroundColor: 'rgba(112,113,118,.95)', //'#707176', //'rgba(0,0,0,.5)',
                borderRadius: 40,
                height: 60,
                width: 60,
                alignSelf: 'center',
              }}>
              <Icon name="play" style={{ fontSize: 30 }} />
            </NBButton>
          </ImageBackground>
        </View>
      ) : (
        <Video
          source={{
            uri: content.video, //content.video,
          }} // Can be a URL or a local file.
          ref={(ref) => {
            setVideoRef(ref);
          }}
          fullscreenAutorotate={false}
          fullscreenOrientation={content.video_orientation}
          controls={true}
          playInBackground={true}
          ignoreSilentSwitch="ignore"
          resizeMode="cover"
          paused={true}
          // poster={content.thumbnail}
          // posterResizeMode="cover"
          onLoad={() => <Spinner />}
          onBuffer={() => <Spinner />} // Callback when remote video is buffering
          onError={handleError} // Callback when video cannot be loaded
          style={styles.backgroundVideo}
        />
      )}

      {/* <Image
        source={{ uri: content.thumbnail }}
        style={{ height: 200, width: null, flex: 1 }}
      /> */}
      <Box row justifyContent="space-between" gt={2} gb={1}>
        <H1 style={{ flex: 4 }}>{content.title}</H1>
        <Box row style={{ flex: 1 }}>
          <Favorite onProfile contentId={content.id} />
          <Download videoUrl={content.video} />
        </Box>
      </Box>

      <Paragraph gb={1}>
        {content.type.toUpperCase()} | {content.length}
      </Paragraph>

      <Paragraph gb={2}>{content.description}</Paragraph>

      <Button
        transparent
        onPress={() =>
          navigation.navigate('Teacher', {
            teacher,
          })
        }>
        <AvyName source={teacher.photo} name={content.teacher} onProfile />
      </Button>
      <Paragraph>{teacher.bio}</Paragraph>
    </Container>
  );
};

export default ContentScreen;
