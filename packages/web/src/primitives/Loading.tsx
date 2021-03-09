import React, { useState } from 'react';
import Spinner from './Spinner';

interface Props {
  loading: boolean;
}

const minimumLoadingTime = 500;

const Loading: React.FC<Props> = ({ loading, children = null, ...props }) => {
  const [isSimulatingLoading, setSimulatedLoading] = useState(true);

  setTimeout(() => {
    setSimulatedLoading(false);
  }, minimumLoadingTime);

  const child = typeof children === 'function' ? children() : children;

  return loading || isSimulatingLoading ? <Spinner /> : child;
};

export default Loading;
