import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';

export const fireFbEvent = (event: string, value?: any) => {
  ReactPixel.track(event, value ? value : {});
};

export const fireGaEvent = (
  category: string,
  action: string,
  label?: string,
) => {
  ReactGA.event({
    category,
    action,
    label: label ? label : undefined,
  });
};
