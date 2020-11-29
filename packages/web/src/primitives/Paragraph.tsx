import React from 'react';
import { Typography, TypographyProps } from '@material-ui/core';

export interface ParagraphProps {
  //   style?: RecursiveArray<false | TextStyle | RegisteredStyle<TextStyle>>;
  gb?: number;
  gt?: number;
  gv?: number;
  fine?: boolean;
  size?: number;
  center?: boolean;
  // fine?: boolean;
}

const Paragraph: React.FC<ParagraphProps & TypographyProps> = ({
  style,
  children,
  size,
  fine,
  gt,
  gb,
  gv,
  center,
  // fine,
  ...props
}) => {
  return (
    <Typography
      align={center ? 'center' : 'inherit'}
      style={{
        fontSize: fine ? 12 : size ? size : 18,
        ...style,
      }}
      {...props}>
      {children}
    </Typography>
  );
};

export default Paragraph;
