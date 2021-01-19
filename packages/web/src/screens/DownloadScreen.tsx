import React from 'react';
import { Card } from '@material-ui/core';
import { Button, Headline, Paragraph, Box } from '../primitives';
import { Apple as AppleIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { useCurrentUser, useHistory } from '../hooks';

const DownloadScreen: React.FC = () => {
  const { auth, translation } = useCurrentUser();
  const history = useHistory();

  return !auth ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Box center>
      <Card elevation={0}>
        <Headline center>{translation["You're In!"]}</Headline>
        <Paragraph center gutterBottom>
          {translation['Click below to get started.']}
        </Paragraph>
        <Box mb={2}>
          <Button
            fullWidth
            color="secondary"
            onClick={() => history.push('/home')}
            text={translation['Go To Homepage']}
          />
        </Box>
        <Button
          fullWidth
          color="secondary"
          onClick={() => {
            window.location.href =
              'https://apps.apple.com/us/app/wellemental-kids-mindfulness/id1531397725';
          }}
          startIcon={<AppleIcon />}
          text={translation['Download iOS']}
        />
      </Card>
    </Box>
  );
};

export default DownloadScreen;
