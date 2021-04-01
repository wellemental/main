import React from 'react';
import Image from './Image';

type Props = {
  source: string;
  size?: number;
  mb?: number;
};
const Avatar: React.FC<Props> = ({ source, size, mb }) => {
  return (
    <Image
      style={{
        height: size ? size : 40,
        width: size ? size : 40,
        borderRadius: 100,
        marginBottom: mb ? mb : 0,
      }}
      source={{
        uri: source,
      }}
    />
  );
};

export default Avatar;
