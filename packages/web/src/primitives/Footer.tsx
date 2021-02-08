import React from 'react';
import Box from './Box';
import Paragraph from './Paragraph';
import { useCurrentUser } from '../hooks';

const Footer = () => {
  const { translation } = useCurrentUser();
  return (
    <Box mx={2} mt={4} mb={2}>
      <Paragraph fine center color="textSecondary">
        Wellemental ©2021 - {translation['Need help?']}
      </Paragraph>
    </Box>
  );
};

export default Footer;
