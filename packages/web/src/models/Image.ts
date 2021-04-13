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
      webp: require('../assets/images/wellemental-logo-full.webp'),
      safari: require('../assets/images/wellemental-logo-full.png'),
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
  bgSleep: {
    alt: 'Sleep Background',
    source: {
      webp: require('../assets/images/wm_bg_sleep.webp'),
      safari: require('../assets/images/wm_bg_sleep.jpg'),
    },
  },
  bgMorning: {
    alt: 'Morning Background',
    source: {
      webp: require('../assets/images/wm_bg_morning.webp'),
      safari: require('../assets/images/wm_bg_morning.jpg'),
    },
  },
  bgAfternoon: {
    alt: 'Afternoon Background',
    source: {
      webp: require('../assets/images/wm_bg_afternoon.webp'),
      safari: require('../assets/images/wm_bg_afternoon.jpg'),
    },
  },
  bgNight: {
    alt: 'Night Background',
    source: {
      webp: require('../assets/images/wm_bg_sleep.webp'),
      safari: require('../assets/images/wm_bg_sleep.jpg'),
    },
  },
  bgLearn: {
    alt: 'Learn Background',
    source: {
      webp: require('../assets/images/wm_bg_learn.webp'),
      safari: require('../assets/images/wm_bg_learn.jpg'),
    },
  },
  bgMove: {
    alt: 'Move Background',
    source: {
      webp: require('../assets/images/wm_bg_move.webp'),
      safari: require('../assets/images/wm_bg_move.jpg'),
    },
  },
};
