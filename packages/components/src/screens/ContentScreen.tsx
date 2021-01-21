import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
  Image,
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
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { DownloadVideoService, PlaysServiceType } from 'services';
import FadeIn from 'react-native-fade-in-image';
import { tracker, TrackingEvents } from 'services';
import { useContainer, useMutation } from '../hooks';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const deviceWidth = Dimensions.get('window').width - 30;
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
    // height: '100%',
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
});

const ContentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { content, teacher } = route.params;
  const [video, setVideo] = useState(content.video);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.seconds);
  const [isBuffering, setBuffering] = useState(false);
  const [isOver, toggleOver] = useState(false);
  const [showPoster, togglePoster] = useState(true);
  const [error, setError] = useState();
  const [isPaused, togglePaused] = useState(true);

  if (showPoster && (currentTime > 0 || !isPaused)) {
    togglePoster(false);
  }

  if (!isOver && currentTime >= duration - 1) {
    toggleOver(true);
  }

  useEffect(() => {
    if (isOver) {
      navigation.navigate('Celebration');
    }
  }, [isOver]);

  // useEffect(() => {
  //   if (showPoster && (currentTime > 0 || !isPaused)) {
  //     togglePoster(false);
  //   }
  // }, [isPaused, showPoster]);

  const service = new DownloadVideoService();

  useEffect(() => {
    const handleGetVideo = async () => {
      const newVideo = await service.getVideo(video);
      setVideo(newVideo);
    };

    handleGetVideo();
  }, []);

  const handleError = (err: any) => {
    setError(err);
  };

  const onProgress = (data) => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
  };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setBuffering(isBuffering);
  };

  const container = useContainer();
  const playsService = container.getInstance<PlaysServiceType>('playsService');
  const { mutate: addPlayCount, loading: adding } = useMutation(() =>
    playsService.add(content.id),
  );

  return (
    <Container>
      {content.video_orientation === 'portrait' ? (
        <View style={{ width: deviceWidth, height: videoHeight }}>
          <ImageBackground
            source={{ uri: content.thumbnail }}
            style={{
              height: videoHeight,
              width: deviceWidth,
              justifyContent: 'center',
              flex: 1,
            }}>
            <NBButton
              onPress={() => {
                tracker.track(TrackingEvents.PlayVideo);
                addPlayCount();
                navigation.navigate('Video', {
                  content,
                  teacher,
                  savedVideoPath: video,
                });
              }}
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
        <View style={{ width: deviceWidth, height: videoHeight }}>
          <Video
            source={{
              uri: content.video, //content.video,
            }} // Can be a URL or a local file.
            style={styles.nativeVideoControls}
            // fullscreen
            // fullscreenAutorotate={true}
            // fullscreenOrientation={content.video_orientation}
            controls={true}
            playInBackground={true}
            ignoreSilentSwitch="ignore"
            resizeMode="cover"
            paused={isPaused}
            poster={content.thumbnail}
            posterResizeMode="cover"
            onBuffer={onBuffer}
            onProgress={onProgress}
            onLoad={onLoad}
            onError={handleError} // Callback when video cannot be loaded
          />
          {showPoster && isPaused && (
            <View style={styles.videoPoster}>
              <FadeIn style={styles.videoPoster}>
                <Image
                  source={{ uri: content.thumbnail }}
                  style={styles.videoPoster}
                />
              </FadeIn>
              <NBButton
                onPress={(): void => {
                  tracker.track(TrackingEvents.PlayVideo);
                  addPlayCount();
                  togglePaused(!isPaused);
                }}
                style={{
                  backgroundColor: 'rgba(112,113,118,.95)', //'#707176', //'rgba(0,0,0,.5)',
                  borderRadius: 40,
                  height: 60,
                  width: 60,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="play" style={{ fontSize: 30 }} />
              </NBButton>
            </View>
          )}
        </View>
      )}

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
