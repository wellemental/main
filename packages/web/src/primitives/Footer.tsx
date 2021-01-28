import React from 'react';
import Box from './Box';
import Paragraph from './Paragraph';

const Footer = () => {
  return (
    <Box mx={2} mt={4} mb={2}>
      <Paragraph fine center color="textSecondary">
        Wellemental ©2021 - hello@wellemental.co
      </Paragraph>
    </Box>
  );
};

export default Footer;
