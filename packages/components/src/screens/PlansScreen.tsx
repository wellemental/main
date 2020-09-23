import React, { useState, useEffect } from 'react';
import { Box, Container, Button, Paragraph, Error, Input } from '../primitives';
import { H1 } from 'native-base';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService } from 'services';

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
  const { auth, translation } = useCurrentUser();
  const [selectedPlan, setPlanId] = useState(IAP_SKUS[0]);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);

  const { processing, setProcessing, status } = useIap();

  useEffect(() => {
    setProcessing(true);
    const getProducts = async () => {
      try {
        console.log('GETTING PRODCUTSI');
        const gotProd = await RNIap.getProducts(IAP_SKUS);
        console.log('GOT PRODCUTSI', gotProd);
        setProducts(gotProd);
      } catch (err) {
        console.log(err);
      }
    };

    getProducts();
  }, [setProcessing]);

  console.log('PRODUCTS', products, 'SELECTED', selectedPlan);
  // fetch values from context

  useEffect(() => {
    if (products) {
      setProcessing(false);
    }
  }, [products, setProcessing]);

  // handle new subscription request
  const handleSubscription = async () => {
    try {
      console.log('REQUEST PURCHASE***');
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
  // submit promo code
  // Check database to see if it's valid
  // that it exists in the db
  // that it's not over it's maximum
  // Update the users to give them access
  // Store local and in db
  // Increment the amount on the promo code

  // Input Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [showAccessDisplay, toggleDisplay] = useState(false);

  const handlePromoCode = async () => {
    const service = new PromoCodeService();
    try {
      await service.validateAndUpgrade(auth.uid, promoCode);
    } catch (err) {
      console.log('ERR', err);
      setError(err);
    }
  };

  return (
    <Container center scrollEnabled>
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

      {!showAccessDisplay ? (
        <Button
          primary
          disabled={processing}
          loading={processing}
          text={translation.Purchase}
          onPress={() => handleSubscription()}
        />
      ) : (
        <>
          <Input
            label={translation['Access code']}
            value={promoCode}
            autoFocus
            onChangeText={setPromoCode}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            primary
            disabled={processing}
            loading={processing}
            text={translation.Submit}
            onPress={() => handlePromoCode()}
          />
        </>
      )}
      <Box gt={1}>
        <Button
          transparent
          disabled={processing}
          loading={processing}
          text={
            showAccessDisplay
              ? translation['New account?']
              : translation['Access code?']
          }
          onPress={() => toggleDisplay(!showAccessDisplay)}
        />
      </Box>
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
