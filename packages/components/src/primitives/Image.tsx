import React from 'react';
import { ImageStyle, StyleProp } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';

type Props = {
  source: { uri: string };
  style: StyleProp<ImageStyle>;
};

const Image: React.FC<Props & FastImageProps> = ({
  style,
  source,
  ...props
}) => {
  return (
    <FastImage
      source={source}
      resizeMode={FastImage.resizeMode.cover}
      style={style}
      {...props}
    />
  );
};

export default Image;
