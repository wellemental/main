import { English } from './en.js';
import { Español } from './es.js';
import { Languages } from 'common';

export const getTranslation = (
  language: Languages,
): { [key: string]: string } => {
  return language === Languages.Es ? Español : English;
};
