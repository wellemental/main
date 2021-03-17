import React from 'react';
import Image from './Image';

type Props = {
  width?: number;
};

const LogoIcon: React.FC<Props> = ({ width }) => {
  const imageDimensions = width ? width : 50;

  return (
    <Image
      src="icon"
      center
      imageStyle={{
        height: imageDimensions,
        width: imageDimensions,
      }}
    />
  );
};

export default LogoIcon;
