import React, { CSSProperties } from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import { ImageNames, imageDir } from '../models/Image';

export type ImageProps = {
  src: ImageNames;
  imageStyle?: CSSProperties;
  center?: boolean;
  width?: number;
};

const Image: React.FC<ImageProps & BoxProps> = ({
  src,
  width,
  padding,
  imageStyle,
  center,
  ...props
}) => {
  const style: CSSProperties = imageStyle ? imageStyle : {};

  if (center) {
    style.display = 'block';
    style.margin = '0 auto';
  }

  if (width) {
    style.width = width;
  }

  return (
    <Box {...props}>
      <picture>
        <source srcSet={imageDir[src].source.webp} type="image/webp" />
        {/* <source srcSet={imageDir[src].src.webp} /> */}
        <img
          style={style}
          src={imageDir[src].source.safari}
          alt={imageDir[src].alt}
        />
      </picture>
    </Box>
  );
};

export default Image;
