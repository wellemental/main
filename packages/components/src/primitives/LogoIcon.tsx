import React from 'react';
import Image from './Image';
import { deviceWidth } from 'services';

const imageWidth = deviceWidth * 0.8;
const imageHeight = imageWidth * 0.4;

const LogoIcon: React.FC = () => {
  return (
    <Image
      source={require('../assets/images/icon.png')}
      style={{
        height: imageHeight,
        width: imageWidth,
        resizeMode: 'contain',
      }}
    />
  );
};

export default LogoIcon;
