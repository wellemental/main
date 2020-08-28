import React from 'react';
// import { auth } from '../base';
import { ApplicationError, AuthenticationError } from '../models/Errors';
import auth from '@react-native-firebase/auth';
import { NewAccount } from '../types';
import LocalStateService from './LocalStateService';
import Logger from './LoggerService';
import tracker, { TrackingEvents } from './TrackerService';

class AuthService {
  public async checkExistingLogins(email: string): Promise<string[]> {
    try {
      return await auth().fetchSignInMethodsForEmail(email);
    } catch (err) {
      Logger.error('Error checking existing logins');
      return Promise.reject(new ApplicationError());
    }
  }

  public async login(email: string, password: string): Promise<void> {
    // Reset local state before sign-in to avoid race conditions with listeners
    const localStateService = new LocalStateService();
    try {
      localStateService.resetStorage();
    } catch (error) {
      return Promise.reject(error);
    }
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      Logger.error('Error logging in');
      switch (err.code) {
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
        case 'auth/wrong-password':
          return Promise.reject(
            new AuthenticationError('Email and password do not match.'),
          );
        default:
          return Promise.reject(new AuthenticationError());
      }
    }
    tracker.track(TrackingEvents.Login);
    return Promise.resolve();
  }

  public async signup(account: NewAccount): Promise<void> {
    try {
      // Reset local state before creating the user to avoid race conditions with listeners
      const localStateService = new LocalStateService();
      try {
        localStateService.resetStorage();
      } catch (err) {
        return Promise.reject(err);
      }

      // Save extra login info to LocalStorage so we can save to database on redirect
      try {
        await localStateService.setStorage('wmBirthday', account.birthday);
        await localStateService.setStorage('wmLanguage', account.language);
        await localStateService.setStorage('wmName', account.name);
      } catch (err) {
        Logger.error(`Failed to set async storage for new account: ${err}`);
      }

      await auth().createUserWithEmailAndPassword(
        account.email,
        account.password,
      );
      tracker.track(TrackingEvents.Login);
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use': {
          return Promise.reject(
            new AuthenticationError('Email already in use. Try signing in.'),
          );
        }
        case 'auth/invalid-email': {
          return Promise.reject(
            new AuthenticationError('Invalid email address.'),
          );
        }
        case 'auth/weak-password': {
          return Promise.reject(
            new AuthenticationError('Please use a stronger password.'),
          );
        }
        default: {
          Logger.error(`Failed to sign up user: ${err}`);
          return Promise.reject(
            new AuthenticationError('An unknown sign up error occurred.'),
          );
        }
      }
    }
    return Promise.resolve();
  }

  public async logout(): Promise<void> {
    try {
      tracker.track(TrackingEvents.Logout);
      return auth().signOut();
    } catch (err) {
      return Promise.reject(
        new AuthenticationError('Unable to logout. Please try again.'),
      );
    }
  }
}

export default AuthService;
