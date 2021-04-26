// Combine with another file or just put directly in content context
// Or build it into a firestore service with a method to get collection
import { Query, ObserveContentServiceType, DocumentReference } from 'common';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

class ObserveContentService
  extends BaseService
  implements ObserveContentServiceType {
  private collection = this.firestore.collection('users');
  private userDoc: DocumentReference;
  public favsQuery: Query;
  public historyQuery: Query;

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
