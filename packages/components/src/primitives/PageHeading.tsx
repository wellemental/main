import React from 'react';
import { H1 } from 'native-base';
import Tabs from './Tabs';
import Paragraph from './Paragraph';
import { View } from 'react-native';
import { TabsType } from '../types';

type Props = {
  title: string;
  subtitle?: string;
  hasTabs?: boolean;
};
const PageHeading: React.FC<Props> = ({ title, subtitle, hasTabs }) => {
  return (
    <View style={{ paddingTop: 45, paddingBottom: hasTabs ? 0 : 25 }}>
      <H1>{title}</H1>
      {subtitle && <Paragraph>{subtitle}</Paragraph>}
    </View>
  );
};

export default PageHeading;
