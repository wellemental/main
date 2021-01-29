import React from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Alert } from 'react-native';
import { ObserveNotificationsType } from '../types';
import { ApplicationError } from '../models/Errors';
import logger from './LoggerService';
import PushNotification from 'react-native-push-notification';

type UnsubscribeFunction = () => void;

class ObserveNotifications implements ObserveNotificationsType {
  private notificationUnsubscriber?: UnsubscribeFunction;
  private tokenUnsubscriber?: UnsubscribeFunction;

  // Types of AuthorizationStatus
  // NOT_DETERMINED = -1,
  // DENIED = 0,
  // AUTHORIZED = 1,
  // PROVISIONAL = 2,

  public checkPermissions = async (): Promise<FirebaseMessagingTypes.AuthorizationStatus> => {
    return await messaging().hasPermission();
  };

  public requestPermissions = async (): Promise<void> => {
    try {
      await messaging().requestPermission();
    } catch (err) {
      logger.warn(`Requesting notification permissions was denied: ${err}`);
      return Promise.reject(
        new ApplicationError(
          "Unable to access the Notification permission. Please enable the Notification Permission from your phone's settings",
        ),
      );
    }

    return Promise.resolve();
  };

  public saveTokenToDatabase = async (token: string): Promise<void> => {
    if (auth().currentUser) {
      // Add the token to the users datastore
      await firestore()
        .collection('users')
        .doc(auth().currentUser.uid)
        .update({
          fcmTokens: firestore.FieldValue.arrayUnion(token),
        });
    }
  };

  public subscribe = async (): Promise<void> => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      // Unsubscribe from any previous subscriptions
      this.unsubscribe();

      // Listen for notifications
      this.notificationUnsubscriber = messaging().onMessage(
        this.handleNotification,
      );

      // Get and save the device token
      messaging()
        .getToken()
        .then((token) => {
          return this.saveTokenToDatabase(token);
        });

      // Listen for token refresh
      this.tokenUnsubscriber = messaging().onTokenRefresh((token) => {
        this.saveTokenToDatabase(token);
      });
    }
  };

  public unsubscribe = (): void => {
    this.notificationUnsubscriber && this.notificationUnsubscriber();
    this.tokenUnsubscriber && this.tokenUnsubscriber();
  };

  private handleNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> => {
    try {
      // Change to equal remoteMessage.data.notification for it to work in Simulator
      const notif: FirebaseMessagingTypes.Notification | undefined =
        remoteMessage.notification;

      if (notif && notif.title) {
        if (notif.title.toLowerCase().includes('emergency')) {
          Alert.alert(notif.title, notif.body);
        }

        const newNotification = {
          id: `remote`,
          title: notif.title ? notif.title : '',
          message: notif.body ? notif.body : '',
          category: 'remoteNotif',
          ignoreInForeground: false,
          allowWhileIdle: true,
          ios: { sound: { critical: true } },
        };
        PushNotification.localNotification(newNotification);
      }
    } catch (error) {
      logger.error(`Failed to handle notification: ${error}`);
    }

    return Promise.resolve();
  };
}

export default ObserveNotifications;
