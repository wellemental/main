import { English } from './en.js';
import { Español } from './es.js';
import { Languages } from '../types';

export const getTranslation = (
  language: Languages,
): { [key: string]: string } => {
  return language === Languages.Es ? Español : English;
};
