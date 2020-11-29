import React from 'react';
import { Card } from '@material-ui/core';
import { Button, Page, Headline, Paragraph } from '../primitives';
import { Apple as AppleIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { useCurrentUser } from '../hooks';

const DownloadScreen: React.FC = () => {
  const { auth } = useCurrentUser();

  return !auth ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Page>
      <Card elevation={0}>
        <Headline center gutterBottom>
          Account upgraded!
        </Headline>
        <Paragraph center gutterBottom>
          Your account has received a complimentary upgrade giving you complete
          access to Wellemental. Click below to download Wellemental on iOS.
        </Paragraph>
        <Button
          fullWidth
          onClick={() => {
            window.location.href =
              'https://apps.apple.com/us/app/wellemental-kids-mindfulness/id1531397725';
          }}
          startIcon={<AppleIcon />}
          text="Download iOS"
        />
      </Card>
    </Page>
  );
};

export default DownloadScreen;
