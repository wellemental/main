import React, { useState, useEffect } from 'react';
import {
  AvyName,
  Box,
  Button,
  Favorite,
  Paragraph,
  Headline,
} from '../primitives';
import Link from '@material-ui/core/Link';
import ReactPlayer from 'react-player';
// import { tracker } from '../services';
import { TrackingEvents } from '../types';
import { useHistory, useRouteMatch, useLocation } from '../hooks';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

type Props = {
  //   route: ContentScreenRouteProp;
  //   navigation: ContentScreenNavigationProp;
};

const Video = ReactPlayer;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playerWrapper: {
      position: 'relative',
      paddingTop: '56.25%' /* Player ratio: 100 / (1280 / 720) */,
    },
    reactPlayer: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
  }),
);

const ContentScreen: React.FC<Props> = () => {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch('content');
  const { state } = useLocation();
  const { teacher, content } = state;

  //   const params = useUrlParams();
  //   const { content, teacher } = route.params;
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
      history.push('/celebration');
    }
  }, [isOver]);

  // useEffect(() => {
  //   if (showPoster && (currentTime > 0 || !isPaused)) {
  //     togglePoster(false);
  //   }
  // }, [isPaused, showPoster]);

  //   const service = new DownloadVideoService();

  //   useEffect(() => {
  //     const handleGetVideo = async () => {
  //       const newVideo = await service.getVideo(video);
  //       setVideo(newVideo);
  //     };

  //     handleGetVideo();
  //   }, []);

  const handleError = (err: any) => {
    setError(err);
  };

  const onProgress = (data: any) => {
    if (!isOver) {
      setCurrentTime(data.currentTime);
    }
  };

  //   const onLoad = (data) => {
  //     setDuration(data.duration);
  //   };

  const onBuffer = ({ isBuffering }: { isBuffering: boolean }) => {
    setBuffering(isBuffering);
  };

  console.log('isPaused', !isPaused);

  return (
    <>
      <div className={classes.playerWrapper}>
        <Video
          className={classes.reactPlayer}
          url={content.video}
          //   source={{
          //     uri: content.video, //content.video,
          //   }} // Can be a URL or a local file.
          // style={styles.nativeVideoControls}
          // fullscreen
          // fullscreenAutorotate={true}
          // fullscreenOrientation={content.video_orientation}
          controls={true}
          width="100%"
          height="100%"
          //   playInBackground={true}
          //   ignoreSilentSwitch="ignore"
          //   resizeMode="cover"
          //   playing={!isPaused}
          //   poster={content.thumbnail}
          file={{ forceVideo: true }}
          light={content.thumbnail}
          //   posterResizeMode="cover"
          // onBuffer={onBuffer}
          onProgress={onProgress}
          //   onLoad={onLoad}
          onError={handleError} // Callback when video cannot be loaded
        />
        {/* {showPoster && isPaused && (
            <div>
              <NBButton
                onPress={() => {
                  tracker.track(TrackingEvents.PlayVideo);
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
            </div>
          )} */}
      </div>

      <Box flexDirection="row" justifyContent="space-between" mt={2} mb={1}>
        <Paragraph variant="h2" size={28} style={{ flex: 4 }}>
          {content.title}
        </Paragraph>
        <Box flexDirection="row" style={{ flex: 1 }}>
          <Favorite onProfile contentId={content.id} />
          {/* <Download videoUrl={content.video} /> */}
        </Box>
      </Box>

      <Paragraph gb={1}>
        {content.type.toUpperCase()} | {content.length}
      </Paragraph>

      <Box mb={2}>
        <Paragraph>{content.description}</Paragraph>
      </Box>

      <Link
        underline="none"
        onClick={() =>
          history.push('/teacher', {
            teacher,
          })
        }>
        <AvyName source={teacher.photo} name={content.teacher} onProfile />
      </Link>
      <Paragraph>{teacher.bio}</Paragraph>
    </>
  );
};

export default ContentScreen;
