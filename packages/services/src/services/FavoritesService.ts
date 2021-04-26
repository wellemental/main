import { FavoritesObj, FavoritesServiceType, Favorite } from 'common';
import { Platform } from 'react-native';
import { ApplicationError } from '../models/Errors';
import BaseService, { BaseServiceContructorOptions } from './BaseService';

class FavoritesService extends BaseService implements FavoritesServiceType {
  constructor(options: BaseServiceContructorOptions) {
    super(options);

    // Migration from having favs on user document to being a subcollection
    if (this.currentUser.favorites) {
      this.import();
    }
  }

  userDoc = this.firestore.collection('users').doc(this.currentUser.id);
  collection = this.userDoc.collection('favorites');
  public query = this.collection.orderBy('createdAt', 'desc');

  public toggle = async (id: string): Promise<void> => {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      // Add to the plays collection
      if (doc.exists) {
        const data = doc.data() as Favorite;
        const isFavorited = data.favorited;

        await docRef.update({ favorited: !isFavorited, updatedAt: new Date() });
      } else {
        await docRef.set({
          contentId: id,
          favorited: true,
          platform: Platform.OS,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (err) {
      throw new ApplicationError('Error favoriting item');
    }
  };

  public import = async (): Promise<void> => {
    try {
      const contentIds = Object.keys(this.currentUser.favorites);
      const favObjects = Object.values(this.currentUser.favorites);
      const batch = this.firestore.batch();

      contentIds.map((contentId, idx) => {
        const fav = favObjects[idx] as Favorite;
        const ref = this.collection.doc(contentId);
        const newFav: Favorite = {
          contentId,
          updatedAt: fav.updatedAt,
          favorited: fav.favorited,
          createdAt: new Date(),
        };
        batch.set(ref, newFav);
      });

      // Batch update, and then set favorites property to null so it doesn't import again
      batch.commit().then(() =>
        this.userDoc.update({
          favorites: null,
        }),
      );
    } catch (err) {
      throw new ApplicationError('Error favoriting item');
    }
  };

  public get = async (): Promise<FavoritesObj> => {
    try {
      const favs: FavoritesObj = {};

      // For use on user profile where it doesn't
      await this.query
        .limit(10)
        .get()
        .then(snapshots =>
          snapshots.docs.forEach(doc => {
            const data = doc.data() as Favorite;
            favs[doc.id] = { ...data };
          }),
        );
      return favs;
    } catch (err) {
      throw new ApplicationError('Error getting user plays');
    }
  };

  public isFavorited = async (id: string): Promise<boolean> => {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      // Add to the plays collection
      if (doc.exists) {
        const data = doc.data() as Favorite;
        const isFavorited = data.favorited;

        return isFavorited;
      } else {
        return false;
      }
    } catch (err) {
      throw new ApplicationError('Error getting favorite');
    }
  };
}

export default FavoritesService;
