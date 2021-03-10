export type Colors = keyof typeof colors;

export const colors = {
  brandPrimary: '#214f4b', // Teal
  brandSecondary: '#2A2968', // Blurple
  brandInfo: '#272a63', //'#9554C2',
  brandSuccess: '#A3CEC9', // Light Green
  brandDanger: '#d9534f', // Light Red #D09932
  brandWarning: '#C78D36', // Orange '#CAAB29',
  brandLight: '#dfbead', // Light Pink
  lightGray: '#838383',
  offWhite: '#F4E6D0',
  white: '#ffffff',
  placeholderGray: '#dbdbdb',
  textColor: 'rgba(0,0,0,0.6)',
  lightTextColor: 'rgba(0, 0, 0, 0.4)',
  darkTextColor: 'rgba(0, 0, 0, 0.87)',
  skyBlue: '#dde2e6',
};

type ColorPairingsObj = {
  [key: string]: {
    main: string;
    light: string;
    text: string;
  };
};

export type ColorPairings = keyof typeof colorPairings;

export const colorPairings: ColorPairingsObj = {
  yellow: {
    main: '#CAAB29',
    light: '#E8C639',
    text: colors.white,
  },
  blurple: {
    main: colors.brandSecondary,
    light: '#46459A',
    text: colors.white,
  },
  orange: {
    main: colors.brandWarning,
    light: '#EFB343',
    text: colors.white,
  },
  teal: {
    main: colors.brandPrimary,
    light: '#336F6A',
    text: colors.white,
  },
};
