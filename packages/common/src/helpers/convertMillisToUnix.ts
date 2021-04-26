export const convertMillisToUnix = (millis: string | number): number => {
  // Safeguarding from apple or google passing undefined or null on field
  return Math.round(+millis / 1000);
};
