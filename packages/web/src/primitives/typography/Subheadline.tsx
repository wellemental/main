import React from 'react';
import Box from '../utils/Box';
import TextBox from '../utils/TextBox';
import Headline from './Headline';
import { MuiTypeColors } from 'common';

type Props = {
  color?: MuiTypeColors | 'white';
};

const Subheadline: React.FC<Props> = ({ color = 'primary', children }) => {
  return (
    <TextBox>
      <Box pt={5} pb={1.5}>
        <Headline
          small
          theColor={color === 'white' ? undefined : color}
          style={{ color: color === 'white' ? 'white' : undefined }}>
          {children}
        </Headline>
      </Box>
    </TextBox>
  );
};

export default Subheadline;
