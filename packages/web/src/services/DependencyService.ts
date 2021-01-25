import { User } from '../types';
import { buildLogger } from './LoggerService';
import { buildTracker } from './TrackerService';
import UpdateUserService from './UpdateUserService';
import { buildFirestore } from './FirebaseService';
// import { buildNavigationService } from './navigationService';
// import { Navigator } from './interfaces';
import RemoteConfig from './RemoteConfig';
import PlaysService from './PlaysService';
// import UpdateProfileService from './UpdateProfileService';

interface DependencyDescriptor {
  dependencies: string[];
  factory?: (...args: any) => any;
  class?: new (...args: any) => any;
}

let dependenciesInstances: { [key: string]: any } = {};

const BASE_SERVICE_DEPENDENCIES = [
  'currentUser',
  'logger',
  'tracker',
  'updateUserService',
  'firestore',
];

const dependenciesDescriptors = {
  firestore: {
    factory: buildFirestore,
    dependencies: [],
  },
  logger: {
    factory: buildLogger,
    dependencies: [],
  },
  tracker: {
    factory: buildTracker,
    dependencies: [],
  },
  updateUserService: {
    class: UpdateUserService,
    dependencies: ['currentUser', 'firestore'],
  },
  remoteConfig: {
    class: RemoteConfig,
    dependencies: BASE_SERVICE_DEPENDENCIES,
  },
  playsService: {
    class: PlaysService,
    dependencies: ['firestore', 'currentUser', 'logger', 'tracker'],
  },
};
export type DependencyName = keyof typeof dependenciesDescriptors;
type DescriptorMap = { [key in DependencyName]: DependencyDescriptor };

const buildDependency = <T>(
  name: DependencyName,
  getDependency: <T>(name: DependencyName) => T,
): T => {
  const dependencyDescriptor = (dependenciesDescriptors as DescriptorMap)[name];

  if (!dependencyDescriptor) {
    throw new Error(
      `Missing dependency descriptor for: ${name} ${dependencyDescriptor}. Forgot to include it in dependencies's container?`,
    );
  }

  const constructorParams: { [key: string]: any } = {};
  for (const dependencyName of dependencyDescriptor.dependencies) {
    const dependencyInstance = getDependency(dependencyName as DependencyName);
    if (!dependencyInstance)
      throw new Error(
        `Missing dependency instance for: ${dependencyName}. Check order in dependencies descriptors`,
      );
    constructorParams[dependencyName] = dependencyInstance;
  }

  let instance;
  if (dependencyDescriptor.factory) {
    instance = dependencyDescriptor.factory(constructorParams);
  } else if (dependencyDescriptor.class) {
    instance = new dependencyDescriptor.class(constructorParams);
  }
  dependenciesInstances[name] = instance;
  return instance;
};

const getOrCreateDependency = <T>(name: DependencyName): T => {
  let dependencyInstance = dependenciesInstances[name];
  if (!dependencyInstance) {
    dependencyInstance = dependenciesInstances[name] = buildDependency(
      name,
      getOrCreateDependency,
    );
  }
  return dependencyInstance;
};

type Params = {
  currentUser?: User;
};

export interface Dependency {
  getInstance<T>(name: DependencyName): T;
}

export function buildDependencies({ currentUser }: Params): Dependency {
  dependenciesInstances = {};
  dependenciesInstances.currentUser = currentUser;
  return {
    getInstance<T>(name: DependencyName): T {
      return getOrCreateDependency(name);
    },
  };
}
