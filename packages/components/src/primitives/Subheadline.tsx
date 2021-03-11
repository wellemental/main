import React from 'react';
import Box from './Box';
import Headline from './Headline';
import { Colors, colors } from 'common';

type Props = {
  color?: Colors;
};

const Subheadline: React.FC<Props> = ({ color, children }) => {
  return (
    <Box pt={4}>
      <Headline
        small
        style={{ color: color ? colors[color] : colors.brandPrimary }}>
        {children}
      </Headline>
    </Box>
  );
};

export default Subheadline;
