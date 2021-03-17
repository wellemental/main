import { Category, Tags } from 'common';

export const ageGroups: Category[] = [
  {
    title: '< 4',
    description: 'Simple practices for early learners',
    image: require('../assets/images/age_under_4.png'),
    tag: Tags.Toddler,
    slug: 'toddler',
  },
  {
    title: '4–9',
    description: 'Elementary mindful practices',
    image: require('../assets/images/age_4_9.png'),
    tag: Tags.PreK,
    slug: 'prek-5',
  },
  {
    title: '10–14',
    description: 'Practices designed for middle-school learning',
    image: require('../assets/images/age_10_14.png'),
    tag: Tags['6-8'],
    slug: '6-8',
  },
  {
    title: '14–18',
    description: 'Resources for mindful development',
    image: require('../assets/images/age_14_18.png'),
    tag: Tags['9-12'],
    slug: '9-12',
  },
];
