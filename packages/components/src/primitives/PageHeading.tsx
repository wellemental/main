import React from 'react';
import { H1 } from 'native-base';
import Paragraph from './Paragraph';
import Avatar from './Avatar';
import { View } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  avatar?: string;
  center?: boolean;
};
const PageHeading: React.FC<Props> = ({ title, subtitle, avatar, center }) => {
  return (
    <View
      style={{
        paddingTop: 45,
        paddingBottom: 25,
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {avatar && <Avatar source={avatar} size={200} mb={30} />}
      <H1>{title}</H1>
      {subtitle && <Paragraph>{subtitle}</Paragraph>}
    </View>
  );
};

export default PageHeading;
