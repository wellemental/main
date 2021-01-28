// import { FirebaseFirestoreTypes } from '../base';
// import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Logger } from './LoggerService';
import { Tracker } from './TrackerService';
import UpdateUserService from './UpdateUserService';
import { User, FirestoreModule } from '../types';

export type BaseServiceContructorOptions = {
  currentUser: User;
  logger: Logger;
  tracker: Tracker;
  updateUserService: UpdateUserService;
  firestore: FirestoreModule; //FirebaseFirestoreTypes.Module;
};

class BaseService {
  protected currentUser: User;
  protected logger: Logger;
  protected tracker: Tracker;
  protected updateUserService: UpdateUserService;
  protected firestore: FirestoreModule;
  constructor({
    currentUser,
    logger,
    tracker,
    updateUserService,
    firestore,
  }: BaseServiceContructorOptions) {
    this.currentUser = currentUser;
    this.logger = logger;
    this.tracker = tracker;
    this.updateUserService = updateUserService;
    this.firestore = firestore;
  }
}

export default BaseService;
