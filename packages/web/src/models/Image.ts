export type ImageNames = 'logo' | 'icon';

export const imageDir = {
  logo: {
    alt: 'Wellemental Logo',
    source: {
      webp: require('../assets/images/logo.jpeg'),
      safari: require('../assets/images/logo.jpeg'),
    },
  },
  icon: {
    alt: 'Wellemental Icon',
    source: {
      webp: require('../assets/images/icon.png'),
      safari: require('../assets/images/icon.png'),
    },
  },
};
