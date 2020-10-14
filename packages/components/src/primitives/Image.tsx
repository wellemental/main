import React from 'react';
import { Image as RNImage, ImageProps } from 'react-native';
import FadeIn from 'react-native-fade-in-image';

const Image: React.FC<ImageProps> = ({ style, source, ...props }) => {
  return (
    <FadeIn style={style}>
      <RNImage source={source} style={style} {...props} />
    </FadeIn>
  );
};

export default Image;
