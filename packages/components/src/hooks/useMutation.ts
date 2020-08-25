import { useState, useCallback } from 'react';

type Query = (...params: any[]) => Promise<any>;

type Callback = (...args: any[]) => void;

interface Result {
  loading: boolean;
  data: null | any;
  error: null | any;
  mutate: (onSuccess?: Callback, onError?: Callback, ...args: any[]) => void;
}

export const useMutation = (query: Query): Result => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    (onSuccess?: Callback, onError?: Callback, ...args: any[]): void => {
      setLoading(true);
      setError(null);
      query(...args)
        .then((result) => {
          setData(result);
          if (typeof onSuccess === 'function') onSuccess();
        })
        .catch((err) => {
          setError(err);
          if (typeof onError === 'function') onError(err);
        })
        .finally(() => setLoading(false));
    },
    [query],
  );
  return {
    loading,
    error,
    data,
    mutate,
  };
};
