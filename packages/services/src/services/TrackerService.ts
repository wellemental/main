// import analytics from '@react-native-firebase/analytics';
// import { TrackingEvents, TrackingService } from '../types';

// export { TrackingEvents } from '../types';

// Segment Tracking Helper
// Apple was rejecting us for sharing data with 3rd parties. Think this was why. Will comment back in if needed.
// export const setUserProperties = async (
//   userId: string | undefined,
//   properties: {
//     [key: string]: any;
//   },
// ): Promise<void> => {
//   try {
//     if (userId) {
//       analytics().setUserId(userId);
//     }
//     analytics().setUserProperties(properties);
//   } catch (err) {
//     logger.error(`GA Set Properties Error - ${err}`);
//   }
// };

// Fire tracking events to Firebase or console
// TODO: Limit EventParams to specific types as we add them & get config variables to work
// type EventParams = {};

// export abstract class Tracker implements TrackingService {
//   abstract track(name: TrackingEvents, params?: EventParams): void;
// }

// class ConsoleTracker extends Tracker {
//   public track(name: TrackingEvents, params?: EventParams): void {
//     console.log(
//       `Track Event: ${name}, params: ${JSON.stringify(params || {})}`,
//     );
//   }
// }

// class FirebaseTracker extends Tracker {
//   public track(name: TrackingEvents, params?: EventParams): void {
//     analytics().logEvent(name, params);
//   }
// }

// const tracker = new FirebaseTracker();
// // Config.ENABLE_FIREBASE_LOGGING === 'true'
// //   ? new FirebaseTracker()
// //   : new ConsoleTracker();

// export const buildTracker = (): Tracker => tracker;
// export default tracker;
