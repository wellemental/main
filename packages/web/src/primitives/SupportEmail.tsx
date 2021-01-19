import React from 'react';
import { Box, Typography } from '@material-ui/core';
import Paragraph from './Paragraph';
import MailIcon from '@material-ui/icons/MailOutline';
import { useCurrentUser } from '../hooks';

const SupportEmail: React.FC = () => {
  const { translation } = useCurrentUser();
  return (
    <Box mt={6} flexDirection="row" display="flex">
      <MailIcon
        style={{ height: 30, width: 60, marginRight: 10, color: '#aaa' }}
      />
      <Box>
        <Paragraph variant="subtitle2" style={{ color: '#aaa' }}>
          {translation['Questions?']}
        </Paragraph>
        <Paragraph variant="subtitle2">
          <a style={{ color: '#aaa' }} href="mailto:hello@wellemental.co">
            hello@wellemental.co
          </a>
        </Paragraph>
      </Box>
    </Box>
  );
};

export default SupportEmail;
