import React from 'react';
import { Box, Typography } from '@material-ui/core';
import MailIcon from '@material-ui/icons/MailOutline';

const SupportEmail: React.FC = () => {
  return (
    <Box mt={6} flexDirection="row" display="flex">
      <MailIcon
        style={{ height: 30, width: 60, marginRight: 10, color: '#aaa' }}
      />
      <Box>
        <Typography variant="subtitle2" style={{ color: '#aaa' }}>
          Questions?{' '}
        </Typography>
        <Typography
          variant="subtitle2"
          style={{ color: '#aaa', fontSize: '12px' }}>
          <a style={{ color: '#aaa' }} href="mailto:hello@wellemental.co">
            hello@wellemental.co
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default SupportEmail;
