import AsyncStorage from '@react-native-community/async-storage';
import { ApplicationError } from '../models/Errors';
import { LocalUser, User } from '../types';
import logger from './LoggerService';

class LocalStateService {
  public async resetStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['wmUser']);
    } catch (error) {
      logger.error(`Failed to reset local state: ${error}`);
      return Promise.reject(
        new ApplicationError('Unable to reset local state.'),
      );
    }

    return Promise.resolve();
  }

  public async setStorage(
    key: string,
    value: string | { [key: string]: string } | LocalUser,
  ): Promise<void> {
    try {
      await AsyncStorage.setItem(
        key,
        typeof value !== 'string' ? JSON.stringify(value) : value,
      );
    } catch (err) {
      logger.error(`Failed to set ${key} to async storage`);
      return Promise.reject(new ApplicationError('Unable to set local state.'));
    }
  }

  public async getStorage(key: string): Promise<string> {
    try {
      return await AsyncStorage.getItem(key);
      // return res ? JSON.parse(res) : res;
    } catch (err) {
      logger.error(`Failed to get ${key} from async storage`);
      return Promise.reject(new ApplicationError('Unable to get local state.'));
    }
  }

  public async removeStorage(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      logger.error(`Failed to remove ${key} from async storage`);
      return Promise.reject(
        new ApplicationError('Unable to remove local state.'),
      );
    }
  }
}

export default LocalStateService;
