import { Tags, CategoryObj } from '../types';

export const categories: CategoryObj = {
  Focus: {
    title: 'Focus',
    tag: Tags.Focus,
    icon: 'glasses',
  },
  Stress: {
    title: 'Anxiety & Stress',
    tag: Tags.Stress,
    icon: 'sunny',
  },
  Energize: {
    title: 'Energize',
    tag: Tags.Energize,
    icon: 'ios-barbell',
  },
  Rest: {
    title: 'Rest',
    tag: Tags.Rest,
    icon: 'bed',
  },
  Philosophy: {
    title: 'Yoga Philosophy',
    tag: Tags.Philosophy,
    icon: 'ios-barbell',
  },
  History: {
    title: 'History',
    tag: Tags.History,
    icon: 'bed',
  },
  Classes: {
    title: 'Full-Length Yoga Classes',
    tag: Tags['Yoga Classes'],
    icon: 'ios-barbell',
  },
  Breaks: {
    title: 'Yoga Breaks',
    tag: Tags['Yoga Breaks'],
    icon: 'bed',
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
