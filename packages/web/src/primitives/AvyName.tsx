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
  return (
    <Box display="flex">
      <Box
        display="flex"
        flexDirection="row"
        style={{
          flex: 5,
          marginTop: '9px',
        }}>
        <Avatar source={source} mb={mb} size={size} />

        <Paragraph
          variant={onProfile ? 'subtitle2' : 'body1'}
          style={{ lineHeight: '40px', marginLeft: '10px' }}>
          {name}
        </Paragraph>
      </Box>

      {favoriteId && <Favorite contentId={favoriteId} />}
    </Box>
  );
};

export default AvyName;
