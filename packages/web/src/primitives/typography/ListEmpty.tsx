import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';
import Box from '../utils/Box';

const ListEmpty: React.FC<ParagraphProps> = ({ children, ...props }) => {
  return (
    <Box px={1} mt={1}>
      <Paragraph {...props}>{children ? children : 'No results'}</Paragraph>
    </Box>
  );
};

export default ListEmpty;
