import { createMuiTheme } from '@material-ui/core/styles';

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
    fontSize: 18,
    fontFamily: [
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
      color: brandColors.brandPrimary,
      fontWeight: '900',
    },
    h1: {
      fontWeight: '700',
      color: brandColors.brandPrimary,
    },
    h2: {
      fontWeight: '700',
      color: brandColors.brandPrimary,
    },
    h3: {
      fontWeight: '700',
      color: brandColors.brandPrimary,
    },
    h4: {
      fontWeight: '700',
      color: brandColors.brandPrimary,
    },
    h5: {
      fontWeight: '700',
      color: brandColors.brandPrimary,
    },
    h6: {
      fontWeight: '900',
      color: brandColors.brandPrimary,
    },
  },
  overrides: {
    // Style sheet name ⚛️
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
        fontWeight: '700',
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
