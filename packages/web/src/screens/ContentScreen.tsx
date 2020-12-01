import React, { useState, useEffect } from 'react';
import { AvyName, Spinner, Box, Favorite, Paragraph } from '../primitives';
import IconButton from '@material-ui/core/IconButton';
import ReactPlayer from 'react-player';
import { tracker } from '../services';
import { TrackingEvents, Teacher, Content } from '../types';
import { useHistory, useContent, useRouteMatch, useLocation } from '../hooks';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PlayArrow as PlayIcon } from '@material-ui/icons';
import { slugify } from '../services/helpers';

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

const ContentScreen: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { teachers, content: allContent } = useContent();
  const match = useRouteMatch('content');

  let teacher: Teacher | null = null;
  let content: Content | null = null;

  if (allContent) {
    content = allContent.filter(
      (content) => slugify(content.title) === match,
    )[0];
  }

  if (content && teachers) {
    teacher = teachers[content.teacher];
  }

  // const { state } = useLocation();
  // const { teacher, content } = state;

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(content && content.seconds);
  const [isOver, toggleOver] = useState(false);
  const [showPoster, togglePoster] = useState(true);
  const [error, setError] = useState();
  const [isPaused, togglePaused] = useState(true);

  if (showPoster && (currentTime > 0 || !isPaused)) {
    togglePoster(false);
  }

  // if (!isOver && currentTime >= duration - 1) {
  //   toggleOver(true);
  // }

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

  const handleError = (err: any) => {
    setError(err);
  };

  const onProgress = (data: any) => {
    if (!isOver) {
      setCurrentTime(data.playedSeconds);
    }
  };

  return !content || !teacher ? (
    <Spinner />
  ) : (
    <>
      <div className={classes.playerWrapper}>
        <Video
          className={classes.reactPlayer}
          url={content.video}
          controls={true}
          width="100%"
          height="100%"
          playIcon={
            <IconButton
              style={{
                backgroundColor: 'rgba(112,113,118,.95)', //'#707176', //'rgba(0,0,0,.5)',
                borderRadius: 40,
                height: 60,
                width: 60,
                alignSelf: 'center',
              }}
              onClick={() => {
                togglePaused(!isPaused);
                tracker.track(TrackingEvents.PlayVideo);
              }}>
              <PlayIcon style={{ color: '#fff' }} />
            </IconButton>
          }
          playing={!isPaused}
          file={{ forceVideo: true }}
          light={content.thumbnail}
          onProgress={onProgress}
          onDuration={setDuration}
          onError={handleError} // Callback when video cannot be loaded
        />
      </div>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        mt={2}
        mb={1}>
        <Paragraph variant="h2" size={28} style={{ flex: 8 }}>
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

      <AvyName
        source={teacher.photo}
        teacher={teacher}
        name={content.teacher}
        onProfile
      />

      <Paragraph>{teacher.bio}</Paragraph>
    </>
  );
};

export default ContentScreen;
