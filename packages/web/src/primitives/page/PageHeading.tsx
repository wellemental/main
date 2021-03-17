import React from 'react';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import Box from '../utils/Box';
import Avatar from '@material-ui/core/Avatar';

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
