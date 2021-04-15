import { Tags, CategoryObj, Redirect } from '../types';

export const categories: CategoryObj = {
  Focus: {
    title: 'Focus',
    tag: Tags.Focus,
    icon: 'image-filter-center-focus',
    iconType: 'MaterialCommunityIcons',
  },
  Stress: {
    title: 'Anxiety & Stress',
    tag: Tags.Stress,
    iconType: 'FontAwesome5',
    icon: 'meh',
  },
  Energize: {
    title: 'Energize',
    tag: Tags.Energize,
    icon: 'trending-up',
    iconType: 'Ionicons',
  },
  Rest: {
    title: 'Rest',
    tag: Tags.Rest,
    icon: 'trending-down',
    iconType: 'Ionicons',
  },
  Philosophy: {
    title: 'Yoga Philosophy',
    tag: Tags.Philosophy,
    icon: 'book-open',
    iconType: 'Feather',
  },
  History: {
    title: 'History',
    tag: Tags.History,
    icon: 'history',
    iconType: 'FontAwesome5',
  },
  Classes: {
    title: 'Full-Length Yoga Classes',
    tag: Tags['Yoga Classes'],
    icon: 'teach',
    iconType: 'MaterialCommunityIcons',
  },
  Breaks: {
    title: 'Yoga Breaks',
    tag: Tags['Yoga Breaks'],
    icon: 'clock',
    iconType: 'Feather',
  },
  New: {
    title: 'New',
    tag: undefined,
    icon: 'clock',
    iconType: 'Feather',
  },
};

export const meditationCategories = [
  categories.Focus,
  categories.Stress,
  categories.Energize,
  categories.Rest,
];
export const learnCategories = [categories.Philosophy, categories.History];
export const moveCategories = [categories.Breaks, categories.Classes];

export const exploreRedirects: Redirect[] = [
  {
    title: 'Teachers',
    icon: 'school',
    page: 'Teachers',
    slug: '/teachers',
  },
  { title: 'Search', icon: 'search', page: 'Search', slug: '/search' },
];
