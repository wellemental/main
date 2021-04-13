import React, { useState, useEffect } from 'react';
import {
  AvyName,
  Spinner,
  Box,
  Favorite,
  Paragraph,
  Button,
  Error,
  Headline,
} from '../primitives';
import IconButton from '@material-ui/core/IconButton';
import ReactPlayer from 'react-player/lazy';
import { Teacher, Content, PlaysServiceType } from 'common';
import {
  useHistory,
  useContent,
  useContainer,
  useMutation,
  useRouteMatch,
  useCurrentUser,
} from '../hooks';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { PlayArrow as PlayIcon } from '@material-ui/icons';
import { slugify } from '../services/helpers';
import { Card, CardContent } from '@material-ui/core';

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
  const { translation, user } = useCurrentUser();
  const history = useHistory();
  const { content: allContent } = useContent();
  const match = useRouteMatch();
  const [error, setError] = useState();
  const [isPaused, togglePaused] = useState(true);
  const [hasPlayed, toggleHasPlayed] = useState(false);
  const [isOver, toggleOver] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  let teacher: Teacher | null = null;
  let content: Content | null = null;

  // Match content based on url - doing this instead of prop passing so you can land directly on content screen
  if (allContent) {
    content = Object.values(allContent).filter(
      content => slugify(content.title) === match,
    )[0];
  }

  // Match teacher based on matched content
  if (content) {
    teacher = content.teacher;
  }

  // Set content duration after match
  useEffect(() => {
    if (content) {
      setDuration(content.seconds);
    }
  }, [content]);

  const handleError = (err: any) => {
    console.log('ERR', err);
    setError(err);
    // logger.error('Error loading video');
  };

  const onProgress = (data: any): void => {
    if (!isOver) {
      setCurrentTime(data.playedSeconds);
    }
  };

  // Get PlaysService
  const container = useContainer();
  const playsService = container.getInstance<PlaysServiceType>('playsService');

  // Reset Has Played when it's a new content page
  useEffect(() => {
    toggleHasPlayed(false);
  }, [content]);

  // Determine when video is over to trigger transition to celebration page
  if (!isOver && duration && currentTime >= duration - 1) {
    toggleOver(true);
  }

  // Increment totalComplete and totalMinutes stats
  const { mutate: markComplete } = useMutation(() =>
    playsService.complete(content ? content.id : '', duration ? duration : 0),
  );

  const handleComplete = (): void => {
    if (content) {
      markComplete();
    }
    // navigation.navigate('Celebration');
  };

  // Trigger handleComplete function once isOver state updates to true
  useEffect(() => {
    if (isOver) {
      handleComplete();
    }
  }, [isOver]);

  // Add to user's recently played when they tap the play button
  const { mutate: addPlayCount, error: addPlayError } = useMutation(() =>
    playsService.add(content ? content.id : ''),
  );

  const handlePlay = (): void => {
    // Only count if it hasn't been logged already
    if (!hasPlayed) {
      if (content && content.id) {
        addPlayCount();
      }
      toggleHasPlayed(true);
    }

    togglePaused(!isPaused);
  };

  return !content || !teacher ? (
    <Spinner />
  ) : (
    <>
      <Button
        text={`‹ ${translation.Back}`}
        variant="text"
        fullWidth
        onClick={() => history.goBack()}
      />
      <Error error={error} />
      <Card elevation={0}>
        <CardContent>
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
                  onClick={handlePlay}>
                  <PlayIcon style={{ color: '#fff' }} />
                </IconButton>
              }
              playing={!isPaused}
              // file={{ forceVideo: true }}
              light={content.thumbnail}
              onError={handleError} // Callback when video cannot be loaded
              // onProgress={onProgress}
            />
          </div>

          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mt={2}
            mb={1}>
            <Headline variant="h5" style={{ flex: 8 }}>
              {content.title}
            </Headline>

            <Box display="flex" flexDirection="row">
              <Favorite onProfile contentId={content.id} />
              {/* <Download videoUrl={content.video} /> */}
            </Box>
          </Box>

          {user &&
            (user.email === 'test@test.com' ||
              user.email === 'mike.r.vosters@gmail.com') && (
              <Box mb={2} mt={-1}>
                <Paragraph fine>{content.id}</Paragraph>
              </Box>
            )}

          <Paragraph gb={1}>
            {content.type.toUpperCase()} | {content.length}
          </Paragraph>

          <Box mb={2}>
            <Paragraph>{content.description}</Paragraph>
          </Box>

          <AvyName
            source={teacher.photo}
            teacher={teacher}
            name={content.teacher.name}
            onProfile
          />

          <Paragraph>{teacher.bio}</Paragraph>
        </CardContent>
      </Card>
    </>
  );
};

export default ContentScreen;
