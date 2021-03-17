import React from 'react';
import TextTranslate from './TextTranslate';
import {
  default as MuiTypography,
  TypographyProps,
} from '@material-ui/core/Typography';

export interface ParagraphProps {
  gb?: number;
  gt?: number;
  gv?: number;
  fine?: boolean;
  size?: number;
  center?: boolean;
  slim?: boolean;
  small?: boolean;
  bold?: boolean;
}

const Paragraph: React.FC<TypographyProps & ParagraphProps> = ({
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
  bold,
  ...props
}) => {
  return (
    <MuiTypography
      align={center ? 'center' : 'inherit'}
      style={{
        fontSize: fine ? 12 : small ? 15 : size ? size : '16px',
        lineHeight: small ? '20px' : 1.625,
        fontWeight: bold ? 'bold' : 'normal',
        ...style,
      }}
      {...props}>
      <TextTranslate>{children}</TextTranslate>
    </MuiTypography>
  );
};

export default Paragraph;
