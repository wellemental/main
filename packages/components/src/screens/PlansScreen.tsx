import React, { useState } from 'react';
import { Box, Container, Button, Paragraph } from '../primitives';
import { H1 } from 'native-base';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
// import * as RNIap from 'react-native-iap';

const bullets = ['Selling Point 1', 'Pint 2', 'point 3'];

// defining IAP SKUs by platform in `constants.ts`
export const IAP_SKUS = Platform.select({
  ios: ['wellemental_pro', 'wellemental_pro_year'],
});

const PlansScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [selectedPlan, setPlanId] = useState(IAP_SKUS[0]);

  console.log('SKUSSS', IAP_SKUS);

  console.log('SELECTED PLAN', selectedPlan);

  // fetch values from context
  const { processing, setProcessing } = useIap();

  // handle new subscription request
  const handleSubscription = async () => {
    try {
      setProcessing(true);
      const res = await requestSubscription(selectedPlan, false);
      console.log('PURCHASE SUCCESS', res);
      setProcessing(false);
    } catch (err) {
      console.log('PURCHASE ERROR', err);
      setProcessing(false);
    }
  };

  return (
    <Container center>
      <Box gb={0.5}>
        <H1>{`${translation.Plans}`}</H1>
      </Box>

      <Box gb={1.5}>
        {bullets.map((bullet) => (
          <Paragraph key={bullet}>{bullet}</Paragraph>
        ))}
      </Box>
      <Button
        primary
        disabled={processing}
        loading={processing}
        text={translation.Purchase}
        onPress={() => handleSubscription()}
      />
    </Container>
  );
};

export default PlansScreen;
