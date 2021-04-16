import React from 'react';
import Paragraph from '../typography/Paragraph';
import Box from '../utils/Box';
import Headline from '../typography/Headline';
import Avatar from '../images/Avatar';
import LogoIcon from '../images/LogoIcon';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from 'common';

export type PageHeadingProps = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
  noHeader?: boolean;
  subheader?: boolean;
  withLogo?: boolean;
  color?: Colors;
  plansScreen?: boolean;
};
const PageHeading: React.FC<PageHeadingProps> = ({
  title,
  subtitle,
  avatar,
  center,
  noHeader,
  subheader,
  withLogo,
  plansScreen,
  color,
}) => {
  const insets = useSafeAreaInsets();
  let pt = plansScreen ? 40 : noHeader ? 30 : 15;

  // Fixes for Android
  if (Platform.OS === 'android' && noHeader) {
    pt = 35 + insets.top;
  } else if (Platform.OS === 'android' && !subheader) {
    pt = 15;
  }

  if (Platform.OS === 'android' && plansScreen) {
    pt = 85;
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
      {avatar && <Avatar source={avatar} size={200} mb={20} />}
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
