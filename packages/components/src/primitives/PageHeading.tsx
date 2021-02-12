import React from 'react';
import Paragraph from './Paragraph';
import Headline from './Headline';
import Avatar from './Avatar';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
  noHeader?: boolean;
  subHeader?: boolean;
};
const PageHeading: React.FC<Props> = ({
  title,
  subtitle,
  avatar,
  center,
  noHeader,
  subheader,
}) => {
  const insets = useSafeAreaInsets();
  let pt = 35;

  if (Platform.OS === 'android' && noHeader) {
    pt = 35 + insets.top;
  } else if (Platform.OS === 'android' && !subheader) {
    pt = 15;
  }

  if (insets.top === 0) {
    pt = 25;
  }

  return (
    <View
      style={{
        paddingTop: pt,
        paddingHorizontal: 5,
        paddingBottom: 25,
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {avatar && <Avatar source={avatar} size={200} mb={30} />}
      <Headline>{title}</Headline>
      {subtitle && <Paragraph style={{ paddingTop: 5 }}>{subtitle}</Paragraph>}
    </View>
  );
};

export default PageHeading;
