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
  slim?: boolean;
  small?: boolean;
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
  small,
  slim,
  // fine,
  ...props
}) => {
  return (
    <Typography
      align={center ? 'center' : 'inherit'}
      style={{
        fontSize: fine ? 12 : small ? 15 : size ? size : 18,
        lineHeight: small ? '20px' : 1.625,
        ...style,
      }}
      {...props}>
      {children}
    </Typography>
  );
};

export default Paragraph;
