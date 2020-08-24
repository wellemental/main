import React from 'react';
// import { auth } from '../base';
import { ApplicationError, AuthenticationError } from '../models/Errors';
import auth from '@react-native-firebase/auth';

class AuthService {
  public async checkExistingLogins(email: string): Promise<string[]> {
    try {
      return await auth().fetchSignInMethodsForEmail(email);
    } catch (err) {
      console.log('Error checking logins', err);
      return Promise.reject(new ApplicationError());
    }
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then((currentUser) => {
          try {
            // Need to fire signup event for GA
            // tracker.track(EventName.SignUp);
            currentUser.user.getIdTokenResult().then((idTokenResult) => {
              console.log('SUCCESS', idTokenResult);
              return Promise.resolve();
            });
          } catch (err) {
            //   logger.error(`TOKEN ERR - ${err}`)
            console.log('ERROR', err);
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
        });
    } catch (err) {
      console.log('ERROR', err);
    }
  }

  public async signup(email: string, password: string): Promise<void> {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
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
          // this.logger.error(`Failed to sign up user: ${err}`);
          return Promise.reject(
            new AuthenticationError('An unknown sign up error occurred.'),
          );
        }
      }
    }
  }

  public async logout(): Promise<void> {
    try {
      return auth().signOut();
    } catch (err) {
      return Promise.reject(
        new AuthenticationError('Unable to logout. Please try again.'),
      );
    }
  }
}

export default AuthService;
