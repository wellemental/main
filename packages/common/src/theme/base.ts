// import { Palette } from './palette';
import { colors } from './light';

export type Theme = {
  //   bgMain: string;
  //   bgAccent: string;
  spacing: number;
  contentPaddingX: number;
  contentPaddingHorizontal: number;
  contentPaddingVertical: number;
  borderRadiusBase: number;
  //   borderWidth: number;
  inputFontSize: number;
  //   disabledColor: string;
  cardPadding: number;
  cardMargin: number;
  boxShadow: string;
  //   shadow: {
  //     shadowColor: string;
  //     shadowOffset: { width: number; height: number };
  //     shadowOpacity: number;
  //     shadowRadius: number;
  //     elevation: number;
  //   };
};

const spacing = 8;

export const theme: Theme = {
  // bgMain: colors.base.main,
  // bgAccent: colors.base.dark,
  spacing: spacing,
  contentPaddingX: 3,
  contentPaddingHorizontal: spacing * 3,
  contentPaddingVertical: spacing,
  borderRadiusBase: 10,
  //   borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  inputFontSize: 16,
  // disabledColor: colors.neutral.main,
  cardMargin: 2 * spacing,
  cardPadding: 2 * spacing,
  boxShadow: '1px 1px 5px 0px rgb(0 0 0 / 20%)',
  //   shadow: {
  //     shadowColor: colors.text.main,
  //     shadowOffset: { width: 2, height: 2 },
  //     shadowOpacity: 0.4,
  //     shadowRadius: 2,
  //     elevation: 3,
  //   },
};
