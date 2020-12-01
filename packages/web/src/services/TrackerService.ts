import firebase from '../base';
import { TrackingEvents, TrackingService } from '../types';

export { TrackingEvents } from '../types';

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
