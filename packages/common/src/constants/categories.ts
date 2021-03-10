import { Tags, CategoryObj } from '../types';

export const categories: CategoryObj = {
  Focus: {
    title: 'Focus',
    tag: Tags.Focus,
    icon: 'target',
    iconType: 'Feather',
  },
  Stress: {
    title: 'Anxiety & Stress',
    tag: Tags.Stress,
    icon: 'meh',
    iconType: 'Feather',
  },
  Energize: {
    title: 'Energize',
    tag: Tags.Energize,
    icon: 'trending-up',
    iconType: 'Feather',
  },
  Rest: {
    title: 'Rest',
    tag: Tags.Rest,
    icon: 'trending-down',
    iconType: 'Feather',
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
};

export const meditationCategories = [
  categories.Focus,
  categories.Stress,
  categories.Energize,
  categories.Rest,
];
export const learnCategories = [categories.Philosophy, categories.History];
export const moveCategories = [categories.Breaks, categories.Classes];
