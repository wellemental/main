import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

export function buildFirestore(): FirebaseFirestoreTypes.Module {
  return firestore();
}
