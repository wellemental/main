import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  ImageBackground,
  Image,
} from 'react-native';
import { Button as NBButton } from 'native-base';
import {
  AvyName,
  Box,
  Button,
  DownloadRow,
  ScrollView,
  Favorite,
  Headline,
  Paragraph,
  Icon,
  Error,
} from '../primitives';
import { ContentScreenNavigationProp, ContentScreenRouteProp } from '../types';
import Video from 'react-native-video';
import { PlaysServiceType } from 'common';
import FadeIn from 'react-native-fade-in-image';
import { useContainer, useMutation, useCurrentUser } from '../hooks';
import { DownloadVideoService, deviceWidth, deviceHeight } from 'services';
import Orientation from 'react-native-orientation-locker';

type Props = {
  route: ContentScreenRouteProp;
  navigation: ContentScreenNavigationProp;
};

const videoHeight = deviceWidth * 0.56;

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    height: videoHeight,
    width: deviceWidth,
  },
  nativeVideoControls: {
    // top: 0,
    height: videoHeight,
    width: deviceWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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

// Need to add handling for buffering and errors
const ContentScreen: React.FC<Props> = ({ navigation, route }) => {
  const { content } = route.params;
  const [video, setVideo] = useState(content.video);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content.seconds);
  // const [isBuffering, setBuffering] = useState(false);
  const [error, setError] = useState();
  const [isOver, toggleOver] = useState(false);
  const [showPoster, togglePoster] = useState(true);
  const [isPaused, togglePaused] = useState(true);
  const [showControls, toggleControls] = useState(true);
  const [hasPlayed, toggleHasPlayed] = useState(false);
  const { isAdmin } = useCurrentUser();

  // Reference for video player to run methods from
  const player = useRef();

  // Get PlaysService
  const container = useContainer();
  const playsService = container.getInstance<PlaysServiceType>('playsService');

  // Hide poster when video has started
  // if (showPoster && currentTime > 2) {
  //   // if (showPoster && (currentTime > 2 || !isPaused)) {
  //   togglePoster(false);
  // }

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

  const android = Platform.OS === 'android';

  const handleComplete = (): void => {
    // Dismiss fullscreen so the CelebrationScreen is shown
    // console.log('STILL COMPLETED!!!!');
    if (!!player.current) {
      // console.log('DISMISSES FULLSCREEN******');
      player.current.dismissFullscreenPlayer();
    }

    if (android) {
      navigation.goBack();
    }

    markComplete();
    navigation.navigate('Celebration');
  };

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
    if (android) {
      navigation.navigate('Video', {
        content,
        savedVideoPath: video,
        handleComplete: handleComplete,
      });
    } else {
      togglePaused(!isPaused);
      // Go to fullscreen automatically when playing
      if (!!player.current) {
        player.current.presentFullscreenPlayer();
      } else {
        // Sanity check in case the player ref doesn't work for some reason
        toggleControls(true);
      }
    }
  };

  // Handle video downloading
  const downloadService = new DownloadVideoService();

  useEffect(() => {
    const handleGetVideo = async (): Promise<void> => {
      try {
        const newVideo = await downloadService.getVideo(video);
        setVideo(newVideo);
      } catch (err) {
        setError(err);
      }
    };

    handleGetVideo();
  }, []);

  const handleError = (err: any): void => {
    setError(err);
  };

  const handleProgress = (data): void => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  const handleLoad = (data): void => {
    setDuration(data.duration);
  };

  const handleBuffer = ({ isBuffering }: { isBuffering: boolean }): void => {
    // setBuffering(isBuffering);
  };

  return (
    <>
      {android ? (
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
              <Icon icon="play" style={{ fontSize: 30 }} />
            </NBButton>
          </ImageBackground>
        </View>
      ) : (
        // For iOS landscape videos - Uses built-in poster method
        <View style={{ width: deviceWidth, height: videoHeight }}>
          <Video
            source={{
              uri: content.video,
            }} // Can be a URL or a local file.
            style={styles.nativeVideoControls}
            controls={false}
            playInBackground={true}
            ignoreSilentSwitch="ignore"
            paused={isPaused}
            poster={content.thumbnail}
            posterResizeMode="cover"
            onBuffer={handleBuffer}
            onLoad={handleLoad}
            onError={handleError}
            onProgress={handleProgress}
            ref={ref => (player.current = ref)}
            repeat={false}
            onEnd={() => {
              handleComplete();
            }}
            onFullScreenEnter={
              content.video_orientation === 'landscape'
                ? () => Orientation.unlockAllOrientations()
                : undefined
            }
            onFullScreenExit={() => Orientation.lockToPortrait()}
            onFullscreenPlayerDidDismiss={() => {
              togglePaused(true);
            }}
            onFullscreenPlayerDidPresent={() => {
              // console.log('onFullscreenPlayerDidPresent');
            }}
          />
          {/* {showPoster && (
            //{showPoster && isPaused && ( */}
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
              <Icon icon="play" style={{ fontSize: 30 }} />
            </NBButton>
            <FadeIn style={styles.videoPoster}>
              <Image
                source={{ uri: content.thumbnail }}
                style={styles.videoPoster}
              />
            </FadeIn>
          </View>
        </View>
      )}
      <ScrollView>
        <Error error={error} />
        <Box row justifyContent="space-between" mt={2} mb={0.5}>
          <Headline style={{ flex: 4 }}>{content.title}</Headline>

          <Favorite onProfile contentId={content.id} />
        </Box>

        <Box row pb={1.5}>
          <Paragraph bold>{content.type} </Paragraph>
          <Paragraph>// {content.length}</Paragraph>
        </Box>

        <Paragraph gb={1}>{content.description}</Paragraph>

        <DownloadRow videoUrl={content.video} />

        <Button
          transparent
          onPress={(): void =>
            navigation.navigate('Teacher', {
              teacher: content.teacher,
            })
          }>
          <AvyName
            source={content.teacher.photo}
            name={content.teacher.name}
            onProfile
          />
        </Button>
        <Paragraph gt={0.5} gb={3}>
          {content.teacher.bio}
        </Paragraph>

        {isAdmin && (
          <Box mt={2}>
            <Paragraph>{content.id}</Paragraph>
            <Paragraph>Current Time: {currentTime}</Paragraph>
            <Paragraph>Show Controls: {showControls.toString()}</Paragraph>
            <Paragraph>Show Poster: {showPoster.toString()}</Paragraph>
            <Paragraph>isPaused: {isPaused.toString()}</Paragraph>
            <Paragraph>Tags: {content.tags.toString()}</Paragraph>
          </Box>
        )}
      </ScrollView>
    </>
  );
};

export default ContentScreen;
