import remoteConfig, {
  FirebaseRemoteConfigTypes,
} from '@react-native-firebase/remote-config';
import defaultValues from './RemoteConfigDefaults';
import { RemoteConfigService } from '../types';
import { ApplicationError } from '../models/Errors';
import logger from '../services/LoggerService';

class RemoteConfig implements RemoteConfigService {
  private remoteConfig: FirebaseRemoteConfigTypes.Module;
  private initialization: Promise<void>;
  constructor() {
    // super(args);
    this.remoteConfig = remoteConfig();
    this.initialization = this.init();
  }

  private init = async (): Promise<void> => {
    try {
      return await remoteConfig()
        .setDefaults(defaultValues)
        .then(() => remoteConfig().fetchAndActivate())
        .then((fetchedRemotely) => {
          if (fetchedRemotely) {
            logger.info(
              'Remote configs were retrieved from the backend and activated.',
            );
          } else {
            logger.error(
              'No remote configs were fetched from the backend, and the local configs were already activated',
            );
          }
        });
    } catch (err) {
      console.log('RC ERR********', err);
      return Promise.reject(new ApplicationError(err));
    }
  };

  public getValue = <T>(valueName: string): Promise<T> => {
    return this.initialization.then(() => {
      const theValue = remoteConfig().getValue(valueName);

      try {
        try {
          return JSON.parse(theValue.asString());
        } catch {
          return theValue.asString();
        }
      } catch (error) {
        throw new ApplicationError(
          `Failed to retrieve config value ${valueName}`,
        );
      }
    });
  };
}

export default RemoteConfig;