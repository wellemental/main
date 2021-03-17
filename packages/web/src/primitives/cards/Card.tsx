import React from 'react';
import Box from '../utils/Box';
import { default as MuiCard, CardProps } from '@material-ui/core/Card';

const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return (
    <Box mb={1} style={{ flex: 1 }} {...props}>
      <MuiCard>{children}</MuiCard>
    </Box>
  );
};

export default Card;
