// Just changing name to match with Native-Base mobile for easier copying
import React from 'react';
import { useNavigation, useCurrentUser } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import Box from '../utils/Box';
import { ageGroups as defaultAgeGroups } from '../../constants';
import { CardActionArea, CardActionAreaProps } from '@material-ui/core';

type Props = {
  onPress: () => void;
};

const CardItem: React.FC<Props & CardActionAreaProps> = ({
  onPress,
  children,
  ...props
}) => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();

  return (
    <CardActionArea onClick={onPress} {...props}>
      {children}
    </CardActionArea>
  );
};

export default CardItem;
