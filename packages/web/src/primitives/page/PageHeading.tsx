import React from 'react';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import Box from '../utils/Box';
import LogoIcon from '../images/LogoIcon';
import Avatar from '../images/Avatar';
import { Colors } from 'common';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
  withLogo?: boolean;
  color?: Colors;
};

const PageHeading: React.FC<Props> = ({
  title,
  subtitle,
  avatar,
  center,
  withLogo,
}) => {
  return (
    <div
      style={{
        paddingTop: '45px',
        textAlign: center ? 'center' : 'left',
        paddingBottom: '25px',
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {withLogo && (
        <Box mb={2}>
          <LogoIcon width={100} />
        </Box>
      )}
      {avatar && (
        <Box mb={3}>
          <Avatar
            source={avatar}
            style={{ width: '200px', height: '200px', margin: '0 auto' }}
          />
        </Box>
      )}
      <Headline
        center={center ? center : false}
        // color={color ? color : undefined}
      >
        {title}
      </Headline>
      {subtitle && (
        <Paragraph
          style={{ paddingTop: 5 }}
          gt={0.5}
          center={center ? center : false}
          // color={color ? color : undefined}
        >
          {subtitle}
        </Paragraph>
      )}
    </div>
  );
};

export default PageHeading;
