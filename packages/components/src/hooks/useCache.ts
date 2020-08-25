import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';
const CACHE: any = {};

type Query<T> = (...args: any) => Promise<T>;

interface CacheResult<T> {
  loading: boolean;
  data: null | T;
  error: null | any;
}

// export const useCache = (query: Query<T>): CacheResult<T> => {
export const useCache = <T>(fn: any, args: any): CacheResult<T> => {
  const prevArgs = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // args is an object so deep compare to rule out false changes
    if (isEqual(args, prevArgs.current)) {
      return;
    }
    // cacheID is how a cache is identified against a unique request
    const cacheID = hashArgs(...args);
    // look in cache and set response if present
    if (CACHE[cacheID] !== undefined) {
      setData(CACHE[cacheID]);
      setLoading(false);
    } else {
      // else make sure loading set to true
      setLoading(true);
      // fetch new data
      fn(...args)
        .then((newData: any) => {
          CACHE[cacheID] = newData;
          setData(newData);
          setLoading(false);
        })
        .catch((err: any) => {
          setError(err);
        });
    }
  }, [args, fn]);

  useEffect(() => {
    prevArgs.current = args;
  });

  return { loading, error, data };
};

function hashArgs(...args: any) {
  return args.reduce((acc: any, arg: any) => stringify(arg) + ':' + acc, '');
}

function stringify(val: any) {
  return typeof val === 'object' ? JSON.stringify(val) : String(val);
}
