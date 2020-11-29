import React from 'react';
// import { H1 } from 'native-base';
import Paragraph from './Paragraph';
import Headline from './Headline';
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
        // paddingHorizontal: '5px',
        paddingBottom: '25px',
        alignItems: center ? 'center' : 'flex-start',
      }}>
      {/* {avatar && <Image source={avatar} size={200} mb={30} />} */}
      <Headline>{title}</Headline>
      {subtitle && <Paragraph style={{ paddingTop: 5 }}>{subtitle}</Paragraph>}
    </div>
  );
};

export default PageHeading;
