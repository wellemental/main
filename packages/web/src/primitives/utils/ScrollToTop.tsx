import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  state?: any;
};

const ScrollToTop: React.FC<Props> = ({ state }) => {
  const { pathname } = useLocation();

  const refresher: any = state ? state : pathname;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [refresher]);

  return null;
};

export default ScrollToTop;
