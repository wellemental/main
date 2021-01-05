export type ImageNames = keyof typeof imageDir;

type ImageDirectory = {
  [key: string]: {
    alt: string;
    source: {
      webp: string;
      safari: string;
    };
  };
};

export const imageDir: ImageDirectory = {
  logo: {
    alt: 'Wellemental Logo',
    source: {
      webp: require('../assets/images/logo.webp'),
      safari: require('../assets/images/logo.png'),
    },
  },
  icon: {
    alt: 'Wellemental Icon',
    source: {
      webp: require('../assets/images/icon.png'),
      safari: require('../assets/images/icon.png'),
    },
  },
  bgGeneral: {
    alt: 'Wellemental Background',
    source: {
      webp: require('../assets/images/bg-general.webp'),
      safari: require('../assets/images/bg-general.jpg'),
    },
  },
};
