/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from 'components/src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  return Promise.resolve('Resolving Background Message Handler', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
