import { AuthenticationError } from '../models/Errors';
import firebase from '../base';
import { NewAccount, Platforms } from 'common';
import UpdateUserService from './UpdateUserService';
import logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';
import { FirebaseError } from 'firebase';

const profileService = new UpdateUserService();
class AuthService {
  public async checkExistingLogins(email: string): Promise<string[]> {
    try {
      return await firebase.auth().fetchSignInMethodsForEmail(email);
    } catch (err) {
      logger.error('Error checking existing logins');
      return Promise.reject(this.checkError(err));
    }
  }

  public async login(email: string, password: string): Promise<void> {
    // Reset local state before sign-in to avoid race conditions with listeners
    // const localStateService = new LocalStateService();
    // try {
    //   localStateService.resetStorage();
    // } catch (error) {
    //   return Promise.reject(error);
    // }
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      logger.error('Error logging in');
      return Promise.reject(this.checkError(err));
    }
    tracker.track(TrackingEvents.Login);
    return Promise.resolve();
  }

  public async signup(account: NewAccount): Promise<void> {
    try {
      // Reset local state before creating the user to avoid race conditions with listeners
      //   const localStateService = new LocalStateService();
      //   try {
      //     await localStateService.resetStorage();
      //   } catch (err) {
      //     return Promise.reject(err);
      //   }

      // // Create base local user for Async Storage, not storing sensitive info
      // const localUser: LocalUser = {
      //   name: account.name,
      //   birthday: account.birthday,
      //   language: account.language,
      //   onboardingComplete: false,
      // };

      // // Save extra login info to LocalStorage so we can save to database on redirect
      // try {
      //   await localStateService.setStorage('wmUser', localUser);
      // } catch (err) {
      //   logger.error(`Failed to set async storage for new account: ${err}`);
      // }

      await firebase
        .auth()
        .createUserWithEmailAndPassword(account.email, account.password)
        .then(async user => {
          if (user && user.user && user.user.email) {
            try {
              await profileService.createProfile({
                id: user.user.uid,
                email: user.user.email,
                language: account.language,
                platform: Platforms.Web,
              });
            } catch (err) {
              logger.error(`Error creating user doc - ${err}`);
            }
          }
        })
        .catch(err => {
          logger.error(`Error creating user and userDoc - ${err}`);
        });
      tracker.track(TrackingEvents.SignUp);
    } catch (err) {
      return Promise.reject(this.checkError(err));
    }
    return Promise.resolve();
  }

  public checkError(err: FirebaseError): Error {
    switch (err.code) {
      case 'auth/email-already-in-use': {
        return new AuthenticationError('Email already in use. Try signing in.');
      }
      case 'auth/weak-password': {
        return new AuthenticationError('Please use a stronger password.');
      }
      case 'auth/invalid-email':
        return new AuthenticationError('Invalid email address.');
      case 'auth/user-not-found':
        return new AuthenticationError(
          'There is no account associated with that email. Please sign up first.',
        );
      case 'auth/wrong-password':
        return new AuthenticationError('Email and password do not match.');
      default: {
        return new AuthenticationError('An unknown login error occurred.');
      }
    }
  }

  public async logout(): Promise<void> {
    try {
      //   tracker.track(TrackingEvents.Logout);
      return firebase.auth().signOut();
    } catch (err) {
      return Promise.reject(
        new AuthenticationError('Unable to logout. Please try again.'),
      );
    }
  }
}

export default AuthService;
