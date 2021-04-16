import { useRef } from 'react';
import { useDepends } from './useDepends';
import { useQuery, Result } from './useQuery';
import { RemoteConfigValues, RemoteConfigServiceType } from 'common';

export type UseConfigResult<T> = Result<T>;

export const useConfig = <T>(name: RemoteConfigValues): Result<T> => {
  const container = useDepends();
  const remoteConfigService = container.getInstance<RemoteConfigServiceType>(
    'remoteConfig',
  );

  const fetchValueRef = useRef(function fetchValue(): Promise<T> {
    return remoteConfigService.getValue(name);
  });
  const result = useQuery<T>(fetchValueRef.current);
  return result;
};
