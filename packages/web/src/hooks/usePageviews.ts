import { useEffect } from 'react';
import { useLocation } from 'react-router';
import ReactGA from 'react-ga';
import ReactPixel, { AdvancedMatching } from 'react-facebook-pixel';
import app from '../base';
import { hotjar } from 'react-hotjar';

// Not Currently using, look in CurrentPlayer
let fbInit = false;
let gaInit = false;
let gaUser = false;
// let pageLoad = false;

type fbEvent = {
  fired: boolean;
  event: { type: string; value?: { value: string; currency: 'USD' } };
};

interface fbEventsType {
  [key: string]: fbEvent[];
}

// Using Facebook Standard Events: https://www.facebook.com/business/help/402791146561655?id=1205376682832142
const fbEvents: fbEventsType = {
  '/': [
    {
      fired: false,
      event: {
        type: 'ViewContent',
      },
    },
  ],
  '/plans': [
    {
      fired: false,
      event: {
        type: 'InitiateCheckout',
      },
    },
  ],
  // '/login': [
  //   {
  //     fired: false,
  //     event: { type: 'AddToCart' },
  //   },
  // ],
  '/checkout': [
    {
      fired: false,
      event: {
        type: 'AddPaymentInfo',
        value: { value: '0.00', currency: 'USD' },
      },
    },
  ],
  // '/download': [
  //   {
  //     fired: false,
  //     event: {
  //       type: 'StartTrial',
  //       value: {
  //         value: '5.00',
  //         currency: 'USD',
  //       },
  //     },
  //   },
  // ],
};

export const usePageviews = (): void => {
  const user = app.auth().currentUser;
  const { pathname } = useLocation();

  // INITIALIZE GOOGLE ANALYTICS
  // Initiate GA Tracking
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      hotjar.initialize(996113, 6);

      if (!gaInit && process.env.REACT_APP_GA_ID) {
        // console.log('INIT GA', gaInit);
        ReactGA.initialize(process.env.REACT_APP_GA_ID);
        ReactGA.send(['pageview', pathname]);
        gaInit = true;
      }

      if (!fbInit && process.env.REACT_APP_FB_PIXEL) {
        const advancedMatching: undefined | AdvancedMatching =
          user && 'email' in user
            ? {
                em: user.email ? user.email : '',
                ct: '',
                country: '',
                db: '',
                fn: '',
                ge: '',
                ln: '',
                ph: '',
                st: '',
                zp: '',
              }
            : undefined;
        // console.log('INIT FACEBOOK', user ? user.email : 'no user');
        ReactPixel.init(process.env.REACT_APP_FB_PIXEL, advancedMatching);
        fbInit = true;
      }

      // if (gaInit && !pageLoad) {
      //   dataLayer.push({ event: 'optimize.activate' });
      //   ReactGA.event({
      //     category: 'Optimize',
      //     action: 'Page Loaded',
      //     nonInteraction: true,
      //   });
      //   pageLoad = true;
      // }

      // Set user tracking for GA
      return app.auth().onAuthStateChanged((user) => {
        if (user && 'uid' in user && !gaUser) {
          // console.log('INIT GA USER', user.uid);
          ReactGA.set({ userId: user.uid });
          gaUser = true;
        }
      });
    }
  }, []);

  // Fire pageviews and events when url changes
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.send(['pageview', pathname]);
      ReactPixel.pageView();

      if (fbEvents[pathname]) {
        const fbEvent = fbEvents[pathname];
        fbEvent.map((event) => {
          if (!event.fired) {
            // console.log('FIRE EVENT', event);
            ReactPixel.track(
              event.event.type,
              event.event.value ? event.event.value : {},
            );
            event.fired = true;
            // console.log('fired', event.fired);
          }
        });
      }
    }
  }, [pathname]);
};
