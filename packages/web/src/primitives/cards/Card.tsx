import React from 'react';
import Box from '../utils/Box';
import { default as MuiCard, CardProps } from '@material-ui/core/Card';
import { theme } from 'common';

type Props = {
  padded?: boolean;
};

const Card: React.FC<Props & CardProps> = ({ children, padded, ...props }) => {
  return (
    <Box mb={1} style={{ flex: 1 }} {...props}>
      <MuiCard style={{ padding: padded ? theme.cardPadding * 2 : undefined }}>
        {children}
      </MuiCard>
    </Box>
  );
};

export default Card;
