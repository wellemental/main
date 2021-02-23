import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

// import { firestore, FirebaseFirestoreTypes } from '../base';

export function buildFirestore(): FirebaseFirestoreTypes.Module {
  return firestore();
}
