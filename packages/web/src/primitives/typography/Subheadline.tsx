import React from 'react';
import Box from '../utils/Box';
import Headline from './Headline';
import { MuiTypeColors } from 'common';

type Props = {
  color?: MuiTypeColors | 'white';
};

const Subheadline: React.FC<Props> = ({ color = 'textPrimary', children }) => {
  return (
    <Box pt={5} pb={1} px={1}>
      <Headline
        small
        color={color === 'white' ? undefined : color}
        style={{ color: color === 'white' ? 'white' : undefined }}>
        {children}
      </Headline>
    </Box>
  );
};

export default Subheadline;
