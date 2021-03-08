import { Tags, CategoryObj } from '../types';

export const categories: CategoryObj = {
  Focus: {
    title: 'Focus',
    tag: Tags.Focus,
    description: 'Description goes here',
    icon: 'glasses',
  },
  Stress: {
    title: 'Anxiety & Stress',
    tag: Tags.Stress,
    description: 'Description goes here',
    icon: 'sunny',
  },
  Energize: {
    title: 'Energize',
    tag: Tags.Energize,
    description: 'Description goes here',
    icon: 'ios-barbell',
  },
  Rest: {
    title: 'Rest',
    tag: Tags.Rest,
    description: 'Description goes here',
    icon: 'bed',
  },
  Philosophy: {
    title: 'Yoga Philosophy',
    tag: Tags.Philosophy,
    description: 'Description goes here',
    icon: 'ios-barbell',
  },
  History: {
    title: 'History',
    tag: Tags.History,
    description: 'Description goes here',
    icon: 'bed',
  },
  Classes: {
    title: 'Full-Length Yoga Classes',
    tag: Tags['Yoga Classes'],
    description: 'Description goes here',
    icon: 'ios-barbell',
  },
  Breaks: {
    title: 'Yoga Breaks',
    tag: Tags['Yoga Breaks'],
    description: 'Description goes here',
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

export const moveCategories = [categories.Philosophy, categories.History];
