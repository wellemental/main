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
      style={{ paddingHorizontal: 5 }}
      color={props.color ? props.color : 'lightText'}
      {...props}>
      {children ? children : 'No results'}
    </Paragraph>
  </Box>
);

export default ListEmpty;
