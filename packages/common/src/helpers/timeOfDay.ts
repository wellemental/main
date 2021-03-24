import moment from 'moment';
import { TimeOfDay, TimeOfDayObj } from '../types';

export const getTimeOfDay = (): TimeOfDayObj => {
  const today = moment();

  // Default to Morning
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = 'Start the day with some morning stretches';

  // Between 7pm and 4am
  const isEvening =
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour');

  // After 12pm noon
  const isAfternoon = today.isAfter(moment().hour(12), 'hour');

  // Set variables accordingly
  if (isEvening) {
    timeOfDay = TimeOfDay.Evening;
    tagline = 'Get ready for bedtime with these soothing practices.';
  } else if (isAfternoon) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = 'Shake out the day with some fun movement.';
  }

  const btnText = `Start ${timeOfDay} Meditation`;
  const headline = `Good ${timeOfDay.toLowerCase()}`;

  return { name: timeOfDay, headline, tagline, btnText };
};
