import React from 'react';
import { getTranslation } from 'common';
import { useCurrentUser } from '../../hooks';

const TextTranslate: React.FC = ({ children }) => {
  const { translation } = useCurrentUser();

  return (
    <>
      {typeof children === 'string'
        ? getTranslation(children, translation)
        : children}
    </>
  );
};

export default TextTranslate;
