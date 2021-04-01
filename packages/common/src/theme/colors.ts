import { colors } from './light';

// Deprecated after we fully transition to using palette and light themes
type ColorPairingsObj = {
  [key: string]: {
    main: string;
    light: string;
    text: string;
  };
};

export type MuiTypeColors =
  | 'initial'
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'textPrimary'
  | 'textSecondary'
  | 'error';

export type ColorPairings = keyof typeof colorPairings;

export const colorPairings: ColorPairingsObj = {
  yellow: {
    main: '#CAAB29',
    light: '#E8C639',
    text: 'white',
  },
  blurple: {
    main: colors.blurple,
    light: '#46459A',
    text: 'white',
  },
  orange: {
    main: colors.tangerine,
    light: '#EFB343',
    text: 'white',
  },
  teal: {
    main: colors.primary,
    light: '#336F6A',
    text: 'white',
  },
};
