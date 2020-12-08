import ogAuth from '@react-native-firebase/auth';
import ogFirestore from '@react-native-firebase/firestore';
// import remoteConfig from '@react-native-firebase/remote-config';
// import analytics from '@react-native-firebase/analytics';
// import functions from '@react-native-firebase/functions';
// import { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// // export const analytics = ogAnalytics;
// // export const functions = ogFunctions;
// export { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config';
// export type FbUser = FirebaseAuthTypes.User;
// export type DocumentSnapshot = OgFirebaseFirestoreTypes.DocumentSnapshot;
// // export const FirebaseFirestoreTypes = OgFirebaseFirestoreTypes;
// // export const remoteConfig = ogRemoteConfig;
export const auth = ogAuth;
export const firestore = ogFirestore;
