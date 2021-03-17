import React from 'react';
import { StyleSheet, TextStyle, TextProps } from 'react-native';
import { H1, H3 } from 'native-base';
import { Colors, getTranslation } from 'common';
import variables from '../../assets/native-base-theme/variables/wellemental';

const TextTranslate: React.FC = ({ children, ...props }) => {
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
