import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Paragraph, Error } from '../primitives';
import { H1 } from 'native-base';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';

const bullets = [
  '50+ meditation and yoga videos',
  'Available in both English and Spanish',
  '100% from teachers of color',
];

// defining IAP SKUs by platform in `constants.ts`
export const IAP_SKUS = Platform.select({
  ios: ['wellemental_pro', 'wellemental_pro_year'],
});

const PlansScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [selectedPlan, setPlanId] = useState(IAP_SKUS[0]);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const gotProd = await RNIap.getProducts(IAP_SKUS);
        setProducts(gotProd);
      } catch (err) {
        console.log(err);
      }
    };

    getProducts();
  }, []);

  // fetch values from context
  const { processing, setProcessing, status } = useIap();

  // handle new subscription request
  const handleSubscription = async () => {
    console.log('REQUEST PURCHASE***');
    try {
      setError('');
      setProcessing(true);
      const res = await requestSubscription(selectedPlan);
      console.log('PURCHASE SUCCESS', res);
      setProcessing(false);
    } catch (err) {
      console.log('PURCHASE ERROR', err);
      setError(err);
      setProcessing(false);
    }
    setProcessing(false);
  };

  return (
    <Container center>
      <Box gb={1}>
        <H1>{`${translation.Plans}`}</H1>
      </Box>

      <Box gb={2}>
        {bullets.map((bullet) => (
          <Paragraph key={bullet} style={{ alignSelf: 'center' }}>
            {bullet}
          </Paragraph>
        ))}
      </Box>
      <Button
        primary
        disabled={processing}
        loading={processing}
        text={translation.Purchase}
        onPress={() => handleSubscription()}
      />
      <Box gt={2}>
        <Error error={error} />
      </Box>
      <Paragraph>Status***</Paragraph>
      {status &&
        status.map((item, idx) => (
          <Paragraph note key={idx + item}>
            *** {item}
          </Paragraph>
        ))}
    </Container>
  );
};

export default PlansScreen;
