import { createMuiTheme } from '@material-ui/core/styles';
import RecoletaAltTtf from '../fonts/RecoletaAlt-Medium.ttf';
import InterTtf from '../fonts/Inter.ttf';

const recoleta = {
  fontFamily: 'RecoletaAlt',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('RecoletaAlt-Medium'),
    local('RecoletaAlt-Medium'),
    url(${RecoletaAltTtf}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const inter = {
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Inter'),
    local('Inter'),
    url(${InterTtf}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export const brandColors = {
  brandPrimary: '#214f4b',
  brandSecondary: '#2A2968',
  brandInfo: '#9554C2',
  brandSuccess: '#A3CEC9',
  brandDanger: '#d9534f',
  brandWarning: '#CAAB29',
  brandLight: '#dfbead',
  lightGray: '#838383',
  offWhite: '#F4E6D0',
  white: '#ffffff',
  placeholderGray: '#dbdbdb',
  textColor: '#333',
  lightTextColor: 'rgba(0, 0, 0, 0.4)',
  darkTextColor: 'rgba(0, 0, 0, 0.87)',
  skyBlue: '#dde2e6',
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: brandColors.brandPrimary,
    },
    secondary: {
      main: brandColors.brandSecondary,
    },
    warning: {
      main: brandColors.brandWarning,
    },
    text: {
      primary: brandColors.brandPrimary,
    },
    inverse: {
      primary: 'white',
    },
    background: {
      default: 'white',
    },
  },
  typography: {
    fontSize: 16,
    fontFamily: [
      'Inter',
      'apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      'Arial',
      'Helvetica Neue',
      'Helvetica',
      'sans-serif',
    ].join(','),
    body1: {
      color: brandColors.textColor,
      lineHeight: 1.625,
    },
    body2: {
      color: brandColors.textColor,
    },
    subtitle1: {
      color: brandColors.textColor,
    },
    subtitle2: {
      fontFamily: 'RecoletaAlt',
      color: brandColors.brandPrimary,
      fontWeight: '900',
    },
    h1: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: brandColors.brandPrimary,
    },
    h2: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      lineHeight: 1.425,
      color: brandColors.brandPrimary,
    },
    h3: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: brandColors.brandPrimary,
    },
    h4: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: brandColors.brandPrimary,
    },
    h5: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: brandColors.brandPrimary,
    },
    h6: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '900',
      color: brandColors.brandPrimary,
    },
  },
  overrides: {
    // Style sheet name ⚛️
    MuiCssBaseline: {
      '@global': {
        '@font-face': [recoleta],
        // '@font-face': [inter],
      },
    },
    MuiContainer: {
      root: {
        position: 'relative',
      },
    },
    MuiGrid: {
      // spacing: '8',
      // Name of the rule
      container: {
        // Some CSS
        alignItems: 'center',
        position: 'relative',
      },
    },
    MuiCard: {
      root: {
        padding: '5%',
      },
    },
    MuiCardHeader: {
      title: {
        fontWeight: '500',
        fontSize: 24,
        color: brandColors.brandPrimary,
      },
    },
    MuiButton: {
      root: {
        // borderRadius: '0px',
      },
      sizeLarge: {
        padding: '15px 25px',
        fontSize: '1.1375rem',
      },
    },
    MuiTypography: {
      gutterBottom: {
        marginBottom: 20,
      },
    },
    MuiToggleButton: {
      root: {},
    },
    'Mui-selected': {
      color: brandColors.brandPrimary,
    },
  },
});
