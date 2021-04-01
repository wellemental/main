import React from 'react';
import { Card, Button, Headline, Paragraph, Box } from '../primitives';
import { Apple as AppleIcon } from '@material-ui/icons';
import { Android as AndroidIcon } from '@material-ui/icons';
import { Redirect } from 'react-router-dom';
import { useCurrentUser, useHistory } from '../hooks';

const DownloadScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const history = useHistory();

  return !user ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Box center mt={4}>
      <Card elevation={0} padded>
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
        <Box mb={2}>
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
        </Box>
        <Button
          fullWidth
          color="secondary"
          onClick={() => {
            window.location.href =
              'https://apps.apple.com/us/app/wellemental-kids-mindfulness/id1531397725';
          }}
          startIcon={<AndroidIcon />}
          text={translation['Download Android']}
        />
      </Card>
    </Box>
  );
};

export default DownloadScreen;
