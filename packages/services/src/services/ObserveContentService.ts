// Combine with another file or just put directly in content context
// Or build it into a firestore service with a method to get collection
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

// Separating from 'common' types bc Typescript throwing error due to diff btw RN Firebase & firebase js
export interface ObserveContentServiceType {
  historyQuery: FirebaseFirestoreTypes.Query;
  favsQuery: FirebaseFirestoreTypes.Query;
}

class ObserveContentService
  extends BaseService
  implements ObserveContentServiceType {
  private collection = this.firestore.collection('users');
  private userDoc: FirebaseFirestoreTypes.DocumentReference;
  public favsQuery: FirebaseFirestoreTypes.Query;
  public historyQuery: FirebaseFirestoreTypes.Query;

  constructor(options: BaseServiceContructorOptions) {
    super(options);
    this.userDoc = this.collection.doc(this.currentUser.id);
    this.historyQuery = this.userDoc
      .collection('plays')
      .orderBy('createdAt', 'desc');
    this.favsQuery = this.userDoc
      .collection('favorites')
      .where('favorited', '==', true)
      .orderBy('createdAt', 'desc');
  }
}

export default ObserveContentService;
