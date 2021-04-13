import React from 'react';
import TextTranslate from './TextTranslate';
import {
  default as MuiTypography,
  TypographyProps,
} from '@material-ui/core/Typography';
import { Colors, colors } from 'common';

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
  component?: 'p' | 'span' | 'li' | 'subtitle1' | 'subtitle2' | 'h6';
  theColor?: Colors;
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
  component,
  small,
  slim,
  bold,
  theColor,
  ...props
}) => {
  return (
    <MuiTypography
      // @ts-ignore - Material-UI Typescipt is a nightmare with type component prop for some reason
      component={component ? component : 'p'}
      align={center ? 'center' : 'inherit'}
      style={{
        fontSize: fine ? 12 : small ? 15 : size ? size : '16px',
        lineHeight: small ? '20px' : 1.625,
        fontWeight: bold ? 'bold' : 'normal',
        color: theColor ? colors[theColor] : colors.text,
        ...style,
      }}
      {...props}>
      <TextTranslate>{children}</TextTranslate>
    </MuiTypography>
  );
};

export default Paragraph;
