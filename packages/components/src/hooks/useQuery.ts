import { useState, useEffect, useCallback } from 'react';

type Query<T> = (...args: any) => Promise<T>;

export interface Result<T> {
  loading: boolean;
  data: null | T;
  error: null | any;
  fetch: () => void;
}

export const useQuery = <T>(query: Query<T>): Result<T> => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(null);

  const fetch = useCallback(
    (...args): void => {
      setLoading(true);
      setError(null);
      query(...args)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    },
    [query],
  );

  useEffect(
    function fetchOnMountOrChange() {
      fetch();
    },
    [fetch],
  );
  return {
    loading,
    error,
    data,
    fetch,
  };
};
