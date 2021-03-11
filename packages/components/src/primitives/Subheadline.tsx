import React from 'react';
import Box from './Box';
import Headline from './Headline';
import { Colors } from 'common';

type Props = {
  color?: Colors;
};

const Subheadline: React.FC<Props> = ({ color, children }) => {
  return (
    <Box pt={5} pb={1} px={1}>
      <Headline small color={color ? color : undefined}>
        {children}
      </Headline>
    </Box>
  );
};

export default Subheadline;
