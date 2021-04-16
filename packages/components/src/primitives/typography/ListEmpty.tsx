import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';
import Box from '../utils/Box';
import { NativeBase } from 'native-base';
import { colors } from 'common';

const ListEmpty: React.FC<ParagraphProps & NativeBase.Text> = ({
  children,
  ...props
}) => (
  <Box mt={1} mx={0.5}>
    <Paragraph
      {...props}
      style={{ color: colors.lightText, paddingHorizontal: 5 }}>
      {children ? children : 'No results'}
    </Paragraph>
  </Box>
);

export default ListEmpty;
