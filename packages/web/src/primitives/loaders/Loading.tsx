import React, { useState } from 'react';
import Spinner from './Spinner';

interface Props {
  loading: boolean;
  fullPage?: boolean;
  text?: string;
}

const minimumLoadingTime = 500;

const Loading: React.FC<Props> = ({
  loading,
  fullPage,
  children = null,
  text,
  ...props
}) => {
  const [isSimulatingLoading, setSimulatedLoading] = useState(true);

  setTimeout(() => {
    setSimulatedLoading(false);
  }, minimumLoadingTime);

  const child = typeof children === 'function' ? children() : children;

  return loading || isSimulatingLoading ? (
    <Spinner fullPage={fullPage} text={text} />
  ) : (
    child
  );
};

export default Loading;
