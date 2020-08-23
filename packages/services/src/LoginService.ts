import React from 'react';
// import firebase from './base';
import auth from '@react-native-firebase/auth';

class LoginService {
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
            });
          } catch (err) {
            //   logger.error(`TOKEN ERR - ${err}`)
            console.log('ERROR', err);
          }
        });
    } catch (err) {
      console.log('ERROR', err);
    }
  }
}

export default LoginService;
