import auth from '@react-native-firebase/auth';

import { AuthenticationError } from '../models/Errors';
import tracker, { TrackingEvents } from './TrackerService';

class ForgotPasswordService {
  public async perform(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-email':
          return Promise.reject(
            new AuthenticationError('Invalid email address.'),
          );
        case 'auth/user-not-found':
          return Promise.reject(
            new AuthenticationError(
              'There is no account associated with that email. Please sign up first.',
            ),
          );
        default:
          return Promise.reject(new AuthenticationError());
      }
    }

    tracker.track(TrackingEvents.PasswordReset);
    return Promise.resolve();
  }
}

export default ForgotPasswordService;
