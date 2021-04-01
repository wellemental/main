// Just changing name to match with Native-Base mobile for easier copying
import React from 'react';
import { CardActionArea, CardActionAreaProps } from '@material-ui/core';

type Props = {
  onPress?: () => void;
};

const CardItem: React.FC<Props & CardActionAreaProps> = ({
  onPress,
  children,
  ...props
}) => {
  return (
    <CardActionArea onClick={onPress} {...props}>
      {children}
    </CardActionArea>
  );
};

export default CardItem;
