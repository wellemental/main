import React from 'react';
import { Linking, Text } from 'react-native';
import Paragraph from './Paragraph';
import Box from '../utils/Box';
import { brandColors } from '../../assets/native-base-theme/variables/wellemental';
import { useCurrentUser } from '../../hooks';
import { Translation } from 'common';

type Props = {
  subs?: boolean;
  translation?: Translation;
};

const LegalLinks: React.FC<Props> = ({ subs, translation }) => {
  const { translation: contextTranslation } = useCurrentUser();

  // AuthScreen is manually passing language from LandingScreen. Can lift that to context and then remove this.
  const theTranslation = translation ? translation : contextTranslation;

  return (
    <Box center mx={1.5}>
      <Paragraph
        note
        fine
        center
        size={16}
        style={{ marginBottom: 20, lineHeight: 20 }}>
        {subs &&
          theTranslation &&
          theTranslation[
            'Recurring billing. Cancel anytime for any reason.'
          ]}{' '}
        {theTranslation['By joining Wellemental you agree to our ']}
        <Text
          style={{ color: brandColors.primary }}
          onPress={() =>
            Linking.openURL('https://www.wellemental.co/terms').catch(err =>
              console.error('An error occurred', err),
            )
          }>
          {theTranslation['terms of use']}
        </Text>{' '}
        <Text>{theTranslation.and} </Text>
        <Text
          style={{ color: brandColors.primary }}
          onPress={() => Linking.openURL('https://www.wellemental.co/privacy')}>
          {theTranslation['privacy policy']}.
        </Text>
      </Paragraph>
    </Box>
  );
};

export default LegalLinks;
