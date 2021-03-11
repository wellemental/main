import React from 'react';
import Paragraph from './Paragraph';
import Box from './Box';
import Headline from './Headline';
import Avatar from './Avatar';
import LogoIcon from './LogoIcon';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from 'common';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
  noHeader?: boolean;
  subheader?: boolean;
  withLogo?: boolean;
  color?: Colors;
};
const PageHeading: React.FC<Props> = ({
  title,
  subtitle,
  avatar,
  center,
  noHeader,
  subheader,
  withLogo,
  color,
}) => {
  const insets = useSafeAreaInsets();
  let pt = noHeader ? 30 : 15;

  if (Platform.OS === 'android' && noHeader) {
    pt = 35 + insets.top;
  } else if (Platform.OS === 'android' && !subheader) {
    pt = 15;
  }

  if (insets.top === 0) {
    pt = 25;
  }

  return (
    <Box
      pb={noHeader ? 1 : 3}
      style={{
        paddingTop: pt,
        paddingHorizontal: 5,
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {withLogo && (
        <Box mb={2}>
          <LogoIcon width={100} />
        </Box>
      )}
      {avatar && <Avatar source={avatar} size={200} mb={30} />}
      <Headline
        center={center ? center : false}
        color={color ? color : undefined}>
        {title}
      </Headline>
      {subtitle && (
        <Paragraph
          gt={0.5}
          center={center ? center : false}
          color={color ? color : undefined}>
          {subtitle}
        </Paragraph>
      )}
    </Box>
  );
};

export default PageHeading;
