import moment from 'moment';
import { Translations, TimeOfDay, TimeOfDayObj } from '../types';

export const getTimeOfDay = (translation: Translations): TimeOfDayObj => {
  const today = moment();
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = translation['Start the day with some morning stretches'];

  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
    tagline =
      translation['Get ready for bedtime with these soothing practices.'];
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = translation['Shake out the day with some fun movement.'];
  }

  const btnText = translation[`Start ${timeOfDay} Meditation`];
  const headline = translation[`Good ${timeOfDay.toLowerCase()}`];

  return { name: timeOfDay, headline, tagline, btnText };
};
