import React from 'react';
// import { H1 } from 'native-base';
import Paragraph from './Paragraph';
import Headline from './Headline';
import Box from './Box';
import Avatar from '@material-ui/core/Avatar';
// import Avatar from './Avatar';
// import { View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
};

const PageHeading: React.FC<Props> = ({ title, subtitle, avatar, center }) => {
  return (
    <div
      style={{
        paddingTop: '45px',
        textAlign: center ? 'center' : 'left',
        paddingBottom: '25px',
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {avatar && (
        <Box mb={3}>
          <Avatar
            src={avatar}
            style={{ width: '200px', height: '200px', margin: '0 auto' }}
          />
        </Box>
      )}
      <Headline>{title}</Headline>
      {subtitle && <Paragraph style={{ paddingTop: 5 }}>{subtitle}</Paragraph>}
    </div>
  );
};

export default PageHeading;
