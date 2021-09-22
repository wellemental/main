import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { ApplicationError } from '../models/Errors';
import {
  LocalUser,
  LocalContent,
  LocalStateServiceType,
  ContentObj,
} from 'common';

const contentStorageKey = 'wmContent';
const userStorageKey = 'wmUser';
const upgradeNoticeTime = 'wmUpgradeNoticeTime';

class LocalStateService implements LocalStateServiceType {
  public async resetStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([userStorageKey, contentStorageKey]);
    } catch (error) {
      // logger.error(`Failed to reset local state: ${error}`);
      return Promise.reject(
        new ApplicationError('Unable to reset local state.'),
      );
    }

    return Promise.resolve();
  }

  public async setStorage<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof value === 'object') {
        value.updated_at = firestore.Timestamp.fromDate(new Date());
      }

      await AsyncStorage.setItem(
        key,
        typeof value !== 'string' ? JSON.stringify(value) : value,
      );
    } catch (err) {
      // logger.error(`Failed to set ${key} to async storage - ${err}`);
      return Promise.reject(new ApplicationError('Unable to set local state.'));
    }
  }

  public async getStorage(key: string): Promise<string> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      // logger.error(`Failed to get ${key} from async storage`);
      return Promise.reject(new ApplicationError('Unable to get local state.'));
    }
  }

  public async getContent(): Promise<LocalContent> {
    try {
      const json = await this.getStorage(contentStorageKey);
      const obj = JSON.parse(json);

      // Create Firestore Timestamp from object
      if (!!obj && obj.updated_at) {
        obj.updated_at = new firestore.Timestamp(
          obj.updated_at.seconds,
          obj.updated_at.nanoseconds,
        ).toDate();
      }
      return obj;
    } catch (err) {
      // logger.error(`Failed to get wmContent from async storage - ${err}`);
      return Promise.reject(
        new ApplicationError('Unable to get local content state.'),
      );
    }
  }

  public setContent = async (newContent: ContentObj): Promise<void> => {
    try {
      await this.setStorage<
        Pick<{ content: ContentObj; updated_at: Date }, 'content'>
      >(contentStorageKey, {
        content: newContent,
      });
    } catch (error) {
      return Promise.reject(
        new ApplicationError('Error setting content local storage'),
      );
    }
  };

  public async getUser(): Promise<LocalUser> {
    try {
      const json = await this.getStorage(userStorageKey);
      const obj = JSON.parse(json);

      // Create Firestore Timestamp from object
      if (obj && obj.updated_at) {
        obj.updated_at = new firestore.Timestamp(
          obj.updated_at._seconds,
          obj.updated_at._nanoseconds,
        ).toDate();
      }
      return obj;
    } catch (err) {
      // logger.error(`Failed to get wmUser from async storage - ${err}`);
      return Promise.reject(
        new ApplicationError('Unable to get local user state.'),
      );
    }
  }

  public async removeStorage(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      // logger.error(`Failed to remove ${key} from async storage`);
      return Promise.reject(
        new ApplicationError('Unable to remove local state.'),
      );
    }
  }

  public async setUpgradeNoticeTime(): Promise<void> {
    try {
      const shown_at = new Date().toLocaleDateString();
      await AsyncStorage.setItem(upgradeNoticeTime, shown_at);
    } catch (err) {
      // logger.error(`Failed to set ${key} to async storage - ${err}`);
      return Promise.reject(new ApplicationError('Unable to set upgrade notice time.'));
    }
  }

  public async getUpgradeNoticeTime(): Promise<string> {
    try {
      return await AsyncStorage.getItem(upgradeNoticeTime);
    } catch (err) {
      // logger.error(`Failed to get ${key} from async storage`);
      return Promise.reject(new ApplicationError('Unable to get upgrade notice time.'));
    }
  }
}

export default LocalStateService;
