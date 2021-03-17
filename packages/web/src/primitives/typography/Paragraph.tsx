import React from 'react';
import { TypographyProps } from '@material-ui/core';
import TextTranslate from './TextTranslate';

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
  bold,
  // fine,
  ...props
}) => {
  return (
    <TextTranslate
      align={center ? 'center' : 'inherit'}
      style={{
        fontSize: fine ? 12 : small ? 15 : size ? size : '16px',
        lineHeight: small ? '20px' : 1.625,
        fontWeight: bold ? 'bold' : 'normal',
        ...style,
      }}
      {...props}>
      {children}
    </TextTranslate>
  );
};

export default Paragraph;
