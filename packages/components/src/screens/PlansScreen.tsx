import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  Paragraph,
  Error,
  Input,
  PageHeading,
} from '../primitives';
import { H1 } from 'native-base';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService } from 'services';

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

  const bullets = [
    translation['100+ meditation and yoga videos'],
    translation['Available in English and Spanish'],
    translation['Led by diverse teachers'],
    translation['Save for offline use'],
  ];

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
    <Container scrollEnabled>
      <PageHeading
        title={translation.Subscribe}
        subtitle={
          translation[
            'Get unlimited access to our content with an annual or monthly subscription.'
          ]
        }
      />

      <Box gb={2}>
        {bullets.map((bullet) => (
          <Paragraph key={bullet}>* {bullet}</Paragraph>
        ))}
      </Box>

      {!showAccessDisplay ? (
        <>
          <Button
            primary
            disabled={processing}
            loading={processing}
            text={translation['Subscribe for $6.99 / mo']}
            onPress={() => handleSubscription()}
          />
          <Box gt={1}>
            <Button
              danger
              disabled={processing}
              loading={processing}
              text={translation['Subscribe for $55 / yr']}
              onPress={() => handleSubscription()}
            />
          </Box>
        </>
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
