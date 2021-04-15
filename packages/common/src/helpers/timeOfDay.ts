import moment from 'moment';
import { TimeOfDay, TimeOfDayObj } from '../types';

export const getTimeOfDay = (): TimeOfDayObj => {
  const today = moment();

  // Default to Morning
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = 'Start the day with some morning stretches';

  // Between 6pm and 4am
  const isEvening =
    today.isSameOrAfter(moment().hour(18), 'hour') ||
    today.isBefore(moment().hour(4), 'hour');

  // After 11am (to 6pm)
  const isAfternoon = today.isSameOrAfter(moment().hour(11).minute(0), 'hours');

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
