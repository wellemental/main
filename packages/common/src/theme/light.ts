import palette, { Palette } from './palette';

export const colors: Palette = {
  base: palette.white,
  inverse: palette.teal,
  primary: palette.teal,
  secondary: palette.blurple,
  info: palette.mustard,
  warning: palette.tangerine,
  danger: palette.salmon,
  success: palette.sage,
  light: palette.pink,
  text: palette.gray,
  lightText: palette.lightGray,
  darkText: palette.darkGray,
  neutral: palette.offWhite,
  ...palette,
};

export type Colors = keyof typeof colors;
