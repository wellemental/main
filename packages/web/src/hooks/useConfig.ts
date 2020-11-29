import { useRef } from 'react';
// import { useDepends } from './useDepends';
import { useQuery, Result } from './useQuery';
import {
  // RemoteConfigService,
  RemoteConfig,
} from '../services';
import { RemoteConfigValues } from '../types';

export type UseConfigResult<T> = Result<T>;
const remoteConfigService = new RemoteConfig();

export const useConfig = <T>(name: RemoteConfigValues): Result<T> => {
  //   const container = useDepends();
  //   const remoteConfigService = container.getInstance<RemoteConfigService>(
  //     'remoteConfig',
  //   );

  const fetchValueRef = useRef(function fetchValue(): Promise<T> {
    return remoteConfigService.getValue(name);
  });
  const result = useQuery<T>(fetchValueRef.current);
  return result;
};
