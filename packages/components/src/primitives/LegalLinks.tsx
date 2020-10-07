import React from 'react';
import { Linking, Text } from 'react-native';
import Paragraph from './Paragraph';
import Box from './Box';

type Props = {
  subs?: boolean;
};

const LegalLinks: React.FC<Props> = ({ subs }) => {
  return (
    <Box center gh={0.5}>
      {subs && (
        <Paragraph note center style={{ color: '#999', marginBottom: 20 }}>
          Recurring billing. Cancel anytime for any reason.
        </Paragraph>
      )}
      <Paragraph note center style={{ color: '#999', marginBottom: 20 }}>
        By joining Wellemental you agree to our{' '}
        <Text
          style={{ color: '#333' }}
          onPress={() =>
            Linking.openURL('https://www.wellemental.co/terms').catch((err) =>
              console.error('An error occurred', err),
            )
          }>
          terms of use
        </Text>{' '}
        and{' '}
        <Text
          style={{ color: '#333' }}
          onPress={() => Linking.openURL('https://www.wellemental.co/privacy')}>
          privacy policy
        </Text>
      </Paragraph>
    </Box>
  );
};

export default LegalLinks;
