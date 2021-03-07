import React from 'react';
import Image from './Image';
import { deviceWidth } from 'services';

type Props = {
  width?: number;
};

const LogoIcon: React.FC<Props> = ({ width }) => {
  const imageDimensions = width ? width : deviceWidth * 0.8;

  return (
    <Image
      source={require('../assets/images/icon.png')}
      style={{
        height: imageDimensions,
        width: imageDimensions,
        resizeMode: 'contain',
      }}
    />
  );
};

export default LogoIcon;
