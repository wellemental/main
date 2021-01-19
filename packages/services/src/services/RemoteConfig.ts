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
      const config = this.remoteConfig;

      // Set minimum fetch internal - setting to 1 hour
      config.settings.minimumFetchIntervalMillis = 0; //3600000;

      // Load default config values in case of error fetching
      config.setDefaults(defaultValues);

      // Activate Remote Config
      const fetchedRemotely = await config.fetchAndActivate();

      if (fetchedRemotely) {
        logger.info(
          'Remote configs were retrieved from the backend and activated.',
        );
      } else {
        logger.error(
          'No remote configs were fetched from the backend, and the local configs were already activated',
        );
      }

      return;
    } catch (err) {
      logger.error(`Error initiating remote config: ${err}`);
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
