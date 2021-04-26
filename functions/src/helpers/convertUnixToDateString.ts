import * as moment from 'moment';

export const convertUnixToDateString = (unix: number): string | null => {
  // Safeguarding from apple or google passing undefined or null on the field
  return typeof unix === 'number'
    ? moment.unix(unix).format('YYYY-MM-DD')
    : null;
};
