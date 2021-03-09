import firebase from '../base';
import { TrackingEvents, TrackingService } from 'common';
import logger from './LoggerService';

export { TrackingEvents } from 'common';

// Segment Tracking Helper
export const setUserProperties = async (
  userId: string | undefined,
  properties: {
    [key: string]: any;
  },
): Promise<void> => {
  try {
    if (userId) {
      firebase.analytics().setUserId(userId);
    }
    firebase.analytics().setUserProperties(properties);
  } catch (err) {
    logger.error(`GA Set Properties Error - ${err}`);
  }
};

// Fire tracking events to Firebase or console
// TODO: Limit EventParams to specific types as we add them
type EventParams = {};

export abstract class Tracker implements TrackingService {
  abstract track(name: TrackingEvents, params?: EventParams): void;
}

class ConsoleTracker extends Tracker {
  public track(name: TrackingEvents, params?: EventParams): void {
    console.log(
      `Track Event: ${name}, params: ${JSON.stringify(params || {})}`,
    );
  }
}

class FirebaseTracker extends Tracker {
  // name should be type Event or EventName, was causing errors
  public track(name: any, params?: EventParams): void {
    firebase.analytics().logEvent(name, params);
  }
}

const tracker =
  process.env.REACT_APP_ENABLE_FIREBASE_LOGGING === 'true'
    ? new FirebaseTracker()
    : new ConsoleTracker();

export const buildTracker = (): Tracker => tracker;
export default tracker;
