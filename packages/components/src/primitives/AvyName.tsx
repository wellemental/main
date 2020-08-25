import React from 'react';
import { View } from 'react-native';
import { H3 } from 'native-base';
import Paragraph from './Paragraph';
import Favorite from './Favorite';
import Avatar from './Avatar';

type Props = {
  source: string;
  size?: number;
  mb?: number;
  name: string;
  favoriteId?: string;
  onProfile?: boolean;
};
const AvyName: React.FC<Props> = ({
  source,
  size,
  mb,
  name,
  favoriteId,
  onProfile,
}) => {
  const Name = onProfile ? H3 : Paragraph;
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          flex: 5,
          flexDirection: 'row',
          alignContent: 'space-between',
        }}>
        <Avatar source={source} mb={mb} size={size} />

        <Name style={{ lineHeight: 40, marginLeft: 10 }}>{name}</Name>
      </View>

      {favoriteId && <Favorite contentId={favoriteId} />}
    </View>
  );
};

export default AvyName;
