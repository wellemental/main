import React from 'react';
import Box from './Box';

const TextBox: React.FC = ({ children }) => {
  return <Box px={1}>{children}</Box>;
};

export default TextBox;
