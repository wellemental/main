import { ConfigDefaults, Tags } from 'common';

const defaults: ConfigDefaults = {
  featured: {
    title: 'Featured',
    'title-es': 'Destacado',
    categories: [
      {
        title: 'Study Break',
        'title-es': 'ES Study Break',
        description: 'Short mindful practices to rest during remote learning.',
        'description-es':
          'ES Short mindful practices to rest during remote learning.',
        tag: Tags.Study,
        image:
          'https://firebasestorage.googleapis.com/v0/b/prod-wellemental.appspot.com/o/featured%2Fstudyhall_category.png?alt=media&token=e7806438-329f-447e-9342-ea79bbf005fe',
      },
      {
        title: 'Black Lives Matter',
        'title-es': 'ES Black Lives Matter',
        description:
          'Practices led by Black instructors for honoring and respecting our roots.',
        'description-es':
          'ES Practices led by Black instructors for honoring and respecting our roots.',
        tag: Tags.Black,
        image:
          'https://firebasestorage.googleapis.com/v0/b/prod-wellemental.appspot.com/o/featured%2Fblm_category.png?alt=media&token=56bf2425-d2eb-4979-a15f-aeac5beade96',
      },
    ],
    event: {
      enabled: true,
      headline: 'Live Event Tonight at 8:30pm EST',
      dayOfWeek: 4,
      hour: 20,
      minute: 30,
      title: 'Live Event',
      articleId: 'live',
      url: 'https://wellemental.co/live',
    },
  },
  version: {
    version: '0.5.2',
    build: 80,
    forceUpgrade: false,
    iosUrl:
      'https://apps.apple.com/us/app/mhl-mental-health-league/id1479870559',
    androidUrl:
      'https://apps.apple.com/us/app/mhl-mental-health-league/id1479870559',
    upgradeForceTitle: 'App Upgrade',
    upgradeForceBody:
      'Tap below to download the latest version of Wellemental.',
  },
};

export default defaults;
