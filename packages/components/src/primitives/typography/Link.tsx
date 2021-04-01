import React from 'react';
import { Linking, Text } from 'react-native';
import { colors } from 'common';

interface Props {
  url: string;
  text: string;
}

const Link: React.FC<Props> = ({ url, text }) => {
  return (
    <Text
      style={{ color: colors.primary, fontWeight: 'bold' }}
      onPress={() =>
        Linking.openURL(url).catch(err =>
          console.error('An error occurred', err),
        )
      }>
      {text}
    </Text>
  );
};

export default Link;
