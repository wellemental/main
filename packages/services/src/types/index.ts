// Transferred everything to 'common' except for a few that are specific to RNFB
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

export { FirebaseError } from 'firebase';
export type Timestamp = FirebaseFirestoreTypes.Timestamp;
export type FieldValue = FirebaseFirestoreTypes.FieldValue;
export type Query = FirebaseFirestoreTypes.Query;
export type QueryDocumentSnapshot = FirebaseFirestoreTypes.QueryDocumentSnapshot;
export type AuthorizationStatus = FirebaseMessagingTypes.AuthorizationStatus;
