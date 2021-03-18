import { createMuiTheme } from '@material-ui/core/styles';
import RecoletaAltTtf from '../fonts/RecoletaAlt-Medium.ttf';
import InterTtf from '../fonts/Inter.ttf';
import { theme as base, colors } from 'common';

export { colors } from 'common';

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

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    warning: {
      main: colors.warning,
    },
    text: {
      primary: colors.text,
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
      color: colors.textColor,
      lineHeight: 1.625,
    },
    body2: {
      color: colors.textColor,
    },
    subtitle1: {
      color: colors.textColor,
    },
    subtitle2: {
      fontFamily: 'RecoletaAlt',
      color: colors.primary,
      fontWeight: '600',
      fontSize: '1.2rem',
    },
    h1: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: colors.primary,
    },
    h2: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      lineHeight: 1.425,
      color: colors.primary,
    },
    h3: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: colors.primary,
    },
    h4: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: colors.primary,
    },
    h5: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '500',
      color: colors.primary,
    },
    h6: {
      fontFamily: 'RecoletaAlt',
      fontWeight: '900',
      color: colors.primary,
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
      maxWidthXs: {
        maxWidth: '500px !important',
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
        // padding: '5%',
        borderRadius: base.borderRadiusBase,
        marginBottom: base.cardMargin,
      },
    },
    MuiCardContent: {
      root: {
        flex: 1,
      },
    },
    MuiCardHeader: {
      title: {
        fontWeight: '500',
        fontSize: 24,
        color: colors.primary,
      },
    },
    MuiButton: {
      root: {
        borderRadius: base.borderRadiusBase,
        textTransform: 'capitalize',
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
      color: colors.primary,
    },
  },
});
