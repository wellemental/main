import { useRef } from 'react';
import { useDepends } from './useDepends';
import { useQuery, Result } from './useQuery';
import { RemoteConfigService, RemoteConfigValues } from 'services';
import {} from 'services';

export type UseConfigResult<T> = Result<T>;

export const useConfig = <T>(name: RemoteConfigValues): Result<T> => {
  const container = useDepends();
  const remoteConfigService = container.getInstance<RemoteConfigService>(
    'remoteConfig',
  );

  const fetchValueRef = useRef(function fetchValue(): Promise<T> {
    return remoteConfigService.getValue(name);
  });
  const result = useQuery<T>(fetchValueRef.current);
  return result;
};
