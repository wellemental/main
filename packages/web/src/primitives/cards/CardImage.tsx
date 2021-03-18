import React from 'react';
import CardMedia, { CardMediaProps } from '@material-ui/core/CardMedia';
import { theme } from 'common';

interface Props {
  src: string;
  width?: number;
  alt?: string;
}

const CardImage: React.FC<CardMediaProps & Props> = ({ src, width, alt }) => {
  return (
    <CardMedia
      component="img"
      alt={alt ? alt : ''}
      height="100%"
      image={src}
      title={alt ? alt : ''}
      style={{
        borderRadius: theme.borderRadiusBase,
      }}
    />
  );
};

export default CardImage;
