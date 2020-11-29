import React from 'react';
// import { H3 } from 'native-base';
import Paragraph from './Paragraph';
import Favorite from './Favorite';
import Avatar from './Avatar';
// import Box from './Box';
import Box from '@material-ui/core/Box';

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
  // const Name = onProfile ? H3 : Paragraph;
  const Name = Paragraph;

  return (
    <Box display="flex" flexDirection="row">
      <Box
        display="flex"
        flexDirection="row"
        style={{
          flex: 5,
          flexDirection: 'row',
          alignContent: 'space-between',
          marginTop: 9,
        }}>
        <Avatar source={source} mb={mb} size={size} />

        <Name style={{ lineHeight: 40, marginLeft: 10 }}>{name}</Name>
      </Box>

      {favoriteId && <Favorite contentId={favoriteId} />}
    </Box>
  );
};

export default AvyName;
