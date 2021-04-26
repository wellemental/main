import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';
import Box from '../utils/Box';
import TextBox from '../utils/TextBox';
import { Colors } from 'common';

interface Props extends ParagraphProps {
  color?: Colors;
}

const ListEmpty: React.FC<Props> = ({ color, children, ...props }) => {
  return (
    <TextBox>
      <Box mt={1}>
        <Paragraph theColor={color} {...props}>
          {children ? children : 'No results'}
        </Paragraph>
      </Box>
    </TextBox>
  );
};

export default ListEmpty;
