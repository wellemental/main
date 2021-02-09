import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { Button as NBButton, Icon } from 'native-base';
import {
  AvyName,
  Box,
  Button,
  Container,
  Download,
  VideoAndroid,
  Favorite,
  Headline,
  Paragraph,
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { DownloadVideoService, PlaysServiceType } from 'services';
import FadeIn from 'react-native-fade-in-image';
import { useContainer, useMutation, useCurrentUser } from '../hooks';
import { deviceWidth, deviceHeight } from 'services';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

// const deviceWidth = deviceWidthOg - 30;
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
  const [showControls, toggleControls] = useState(false);
  const [hasPlayed, toggleHasPlayed] = useState(false);
  const { auth } = useCurrentUser();

  // Hide poster when video has started
  if (showPoster && (currentTime > 0 || !isPaused)) {
    togglePoster(false);
  }

  // Get PlaysService
  const container = useContainer();
  const playsService = container.getInstance<PlaysServiceType>('playsService');

  // Reset Has Played when it's a new content page
  useEffect(() => {
    toggleHasPlayed(false);
  }, [content]);

  // Determine when video is over to trigger transition to celebration page
  if (!isOver && currentTime >= duration - 1) {
    toggleOver(true);
  }

  // Increment totalComplete and totalMinutes stats
  const { mutate: markComplete } = useMutation(() =>
    playsService.complete(content.id, duration),
  );

  const handleComplete = (): void => {
    markComplete();
    navigation.navigate('Celebration');
  };

  // Trigger handleComplete function once isOver state updates to true
  useEffect(() => {
    if (isOver) {
      handleComplete();
    }
  }, [isOver]);

  // Add to user's recently played when they tap the play button
  const { mutate: addPlayCount } = useMutation(() =>
    playsService.add(content.id),
  );

  const handlePlay = (): void => {
    // Only count if it hasn't been logged already
    if (!hasPlayed) {
      addPlayCount();
      toggleHasPlayed(true);
    }

    // If vertical video, trigger to VideoScreen, if not just play the video
    if (content.video_orientation === 'portrait') {
      navigation.navigate('Video', {
        content,
        teacher,
        savedVideoPath: video,
        handleComplete: handleComplete,
      });
    } else {
      toggleControls(!showControls);
      togglePaused(!isPaused);
    }
  };

  const service = new DownloadVideoService();

  useEffect(() => {
    const handleGetVideo = async (): Promise<void> => {
      const newVideo = await service.getVideo(video);
      setVideo(newVideo);
    };

    handleGetVideo();
  }, []);

  const handleError = (err: any): void => {
    setError(err);
  };

  const onProgress = (data): void => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data): void => {
    setDuration(data.duration);
  };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }): void => {
    setBuffering(isBuffering);
  };

  return (
    <>
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
              onPress={handlePlay}
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
          {Platform.OS === 'android' ? (
            <VideoAndroid
              source={{
                uri: content.video,
              }}
              paused={isPaused}
              poster={content.thumbnail}
            />
          ) : (
            <Video
              source={{
                uri: content.video,
              }} // Can be a URL or a local file.
              style={styles.nativeVideoControls}
              controls={true}
              playInBackground={true}
              ignoreSilentSwitch="ignore"
              resizeMode="cover"
              paused={isPaused}
              poster={content.thumbnail}
              posterResizeMode="cover"
              onBuffer={onBuffer}
              onLoad={onLoad}
              onError={handleError}
              onProgress={onProgress}
            />
          )}
          {showPoster && isPaused && (
            <View style={styles.videoPoster}>
              <NBButton
                onPress={handlePlay}
                style={{
                  backgroundColor: 'rgba(112,113,118,.95)',
                  borderRadius: 40,
                  height: 60,
                  zIndex: 100,
                  width: 60,
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="play" style={{ fontSize: 30 }} />
              </NBButton>
              <FadeIn style={styles.videoPoster}>
                <Image
                  source={{ uri: content.thumbnail }}
                  style={styles.videoPoster}
                />
              </FadeIn>
            </View>
          )}
        </View>
      )}
      <Container scrollEnabled>
        {auth &&
          (auth.email === 'test@test.com' ||
            auth.email === 'mike.r.vosters@gmail.com') && (
            <>
              <Paragraph>Current Time: {currentTime}</Paragraph>
              <Paragraph>Show Controls: {showControls.toString()}</Paragraph>
              <Paragraph>Show Poster: {showPoster.toString()}</Paragraph>
              <Paragraph>isPaused: {isPaused.toString()}</Paragraph>
            </>
          )}

        <Box row justifyContent="space-between" mt={2} mb={1}>
          <Headline style={{ flex: 4 }}>{content.title}</Headline>
          <Box row>
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
          onPress={(): void =>
            navigation.navigate('Teacher', {
              teacher,
            })
          }>
          <AvyName source={teacher.photo} name={content.teacher} onProfile />
        </Button>
        <Paragraph>{teacher.bio}</Paragraph>
      </Container>
    </>
  );
};

export default ContentScreen;
