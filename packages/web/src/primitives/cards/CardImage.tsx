import React from 'react';
import CardMedia, { CardMediaProps } from '@material-ui/core/CardMedia';

interface Props {
  src: string;
  width?: number;
  alt?: string;
}

const ContentCard: React.FC<CardMediaProps & Props> = ({
  src,
  width,
  alt,
  ...props
}) => {
  return (
    <CardMedia
      component="img"
      alt={alt ? alt : ''}
      height={`${width ? width : 125}px`}
      image={src}
      title={alt ? alt : ''}
      style={{ width: `${width ? width : 125}px`, borderRadius: '20px' }}
    />
  );
};

export default ContentCard;
