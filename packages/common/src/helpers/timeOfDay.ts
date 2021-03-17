import moment from 'moment';
import { Translation, TimeOfDay, TimeOfDayObj } from '../types';

export const getTimeOfDay = (translation: Translation): TimeOfDayObj => {
  const today = moment();

  // Default to Morning
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = translation['Start the day with some morning stretches'];

  // Between 7pm and 4am
  const isEvening =
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour');

  // After 12pm noon
  const isAfternoon = today.isAfter(moment().hour(12), 'hour');

  // Set variables accordingly
  if (isEvening) {
    timeOfDay = TimeOfDay.Evening;
    tagline =
      translation['Get ready for bedtime with these soothing practices.'];
  } else if (isAfternoon) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = translation['Shake out the day with some fun movement.'];
  }

  const btnText = translation[`Start ${timeOfDay} Meditation`];
  const headline = translation[`Good ${timeOfDay.toLowerCase()}`];

  return { name: timeOfDay, headline, tagline, btnText };
};
