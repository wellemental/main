import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

export interface Headline {
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
  center?: boolean;
}

const Headline: React.FC<Headline & TypographyProps> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
  center,
  ...props
}) => {
  return (
    <Typography
      component="h2"
      align={center ? 'center' : 'inherit'}
      variant={props.variant ? props.variant : 'h4'}
      gutterBottom={props.gutterBottom ? props.gutterBottom : false}>
      {children}
    </Typography>
  );
};

export default Headline;
