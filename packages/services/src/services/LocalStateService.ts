import AsyncStorage from '@react-native-community/async-storage';
import { ApplicationError } from '../models/Errors';
import { LocalUser, LocalContent, UserProfile } from '../types';
import Logger from './LoggerService';
import firestore from '@react-native-firebase/firestore';

class LocalStateService {
  public async resetStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['wmUser', 'wmContent']);
    } catch (error) {
      Logger.error(`Failed to reset local state: ${error}`);
      return Promise.reject(
        new ApplicationError('Unable to reset local state.'),
      );
    }

    return Promise.resolve();
  }

  public async setStorage(
    key: string,
    value: string | { [key: string]: string } | LocalUser | UserProfile,
  ): Promise<void> {
    try {
      if (typeof value === 'object') {
        value.updated_at = firestore.Timestamp.fromDate(new Date());
      }

      await AsyncStorage.setItem(
        key,
        typeof value !== 'string' ? JSON.stringify(value) : value,
      );
    } catch (err) {
      Logger.error(`Failed to set ${key} to async storage - ${err}`);
      return Promise.reject(new ApplicationError('Unable to set local state.'));
    }
  }

  public async getStorage(key: string): Promise<string> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (err) {
      Logger.error(`Failed to get ${key} from async storage`);
      return Promise.reject(new ApplicationError('Unable to get local state.'));
    }
  }

  public async getContent(): Promise<LocalContent> {
    try {
      const json = await this.getStorage('wmContent');
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
      Logger.error(`Failed to get wmContent from async storage - ${err}`);
      return Promise.reject(
        new ApplicationError('Unable to get local content state.'),
      );
    }
  }

  public async getUser(): Promise<LocalUser> {
    try {
      const json = await this.getStorage('wmUser');
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
      Logger.error(`Failed to get wmUser from async storage - ${err}`);
      return Promise.reject(
        new ApplicationError('Unable to get local user state.'),
      );
    }
  }

  public async removeStorage(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      Logger.error(`Failed to remove ${key} from async storage`);
      return Promise.reject(
        new ApplicationError('Unable to remove local state.'),
      );
    }
  }
}

export default LocalStateService;
