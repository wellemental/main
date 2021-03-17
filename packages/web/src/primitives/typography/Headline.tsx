import React from 'react';
import TextTranslate from './TextTranslate';
import {
  default as MuiTypography,
  TypographyProps,
} from '@material-ui/core/Typography';

export interface HeadlineProps {
  gb?: number;
  gt?: number;
  gv?: number;
  size?: number;
  center?: boolean;
  small?: boolean;
  component?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h4'
    | 'h5'
    | 'subtitle1'
    | 'subtitle2';
}

const Headline: React.FC<TypographyProps & HeadlineProps> = ({
  style,
  children,
  size,
  gt,
  gb,
  gv,
  center,
  small,
  component,
  // color = 'brandPrimary',
  ...props
}) => {
  return (
    <MuiTypography
      // @ts-ignore - Material-UI Typescipt is a nightmare with type component prop for some reason
      component={component ? component : 'h2'}
      align={center || props.align === 'center' ? 'center' : 'inherit'}
      variant={small ? 'h5' : props.variant ? props.variant : 'h4'}
      gutterBottom={props.gutterBottom ? props.gutterBottom : false}
      {...props}>
      <TextTranslate>{children}</TextTranslate>
    </MuiTypography>
  );
};

export default Headline;
