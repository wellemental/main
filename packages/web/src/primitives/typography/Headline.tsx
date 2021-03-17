import React from 'react';
import TextTranslate from './TextTranslate';
import { TypographyProps } from '@material-ui/core';
import { Colors } from 'common';

export interface Headline {
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
  center?: boolean;
  small?: boolean;
  color?: Colors;
}

const Headline: React.FC<Headline & TypographyProps> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
  center,
  small,
  color,
  ...props
}) => {
  return (
    <TextTranslate
      component="h2"
      color="primary"
      align={center || props.align === 'center' ? 'center' : 'inherit'}
      variant={small ? 'h5' : props.variant ? props.variant : 'h4'}
      gutterBottom={props.gutterBottom ? props.gutterBottom : false}>
      {children}
    </TextTranslate>
  );
};

export default Headline;
