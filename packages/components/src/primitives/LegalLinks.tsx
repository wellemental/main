import React from 'react';
import { Linking, Text } from 'react-native';
import Paragraph from './Paragraph';
import Box from './Box';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';
import { useCurrentUser } from '../hooks';

type Props = {
  subs?: boolean;
};

const LegalLinks: React.FC<Props> = ({ subs }) => {
  const { translation } = useCurrentUser();
  return (
    <Box center mh={1.5}>
      <Paragraph note center style={{ color: '#999', marginBottom: 20 }}>
        {subs &&
          translation['Recurring billing. Cancel anytime for any reason.']}
        {translation['By joining Wellemental you agree to our ']}
        <Text
          style={{ color: brandColors.brandPrimary }}
          onPress={() =>
            Linking.openURL('https://www.wellemental.co/terms').catch((err) =>
              console.error('An error occurred', err),
            )
          }>
          {translation['terms of use']}
        </Text>{' '}
        <Text>{translation.and} </Text>
        <Text
          style={{ color: brandColors.brandPrimary }}
          onPress={() => Linking.openURL('https://www.wellemental.co/privacy')}>
          {translation['privacy policy']}.
        </Text>
      </Paragraph>
    </Box>
  );
};

export default LegalLinks;
