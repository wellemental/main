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
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService, logger } from 'services';

// defining IAP SKUs by platform in `constants.ts`
export const IAP_SKUS = Platform.select({
  ios: ['wellemental_pro', 'wellemental_pro_year'],
});

export enum PlanId {
  Monthly = 'wellemental_pro',
  Yearly = 'wellemental_pro_year',
  Free = 'free',
  Group = 'group',
}

const PlansScreen: React.FC = () => {
  const { auth, user, translation } = useCurrentUser();
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
        const gotProd = await RNIap.getProducts(IAP_SKUS);
        setProducts(gotProd);
      } catch (err) {
        setError(
          `Unable to retrieve products. Please try again or contact support@wellemental.co`,
        );
        logger.error(`Error retrieving Iap Products - ${err}`);
      }
      setProcessing(false);
    };

    getProducts();
  }, [setProcessing]);

  // handle new subscription request
  const handleSubscription = async (plan: PlanId) => {
    try {
      setError('');
      setProcessing(true);
      await requestSubscription(plan);
      setProcessing(false);
    } catch (err) {
      setError(err);
      setProcessing(false);
    }
    setProcessing(false);
  };

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
            onPress={() => handleSubscription(PlanId.Monthly)}
          />
          <Box gt={1}>
            <Button
              danger
              disabled={processing}
              loading={processing}
              text={translation['Subscribe for $55 / yr']}
              onPress={() => handleSubscription(PlanId.Yearly)}
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

      <Error error={error} center />

      {auth && auth.email === 'mike.r.vosters@gmail.com' && status && (
        <Box gt={2}>
          <Paragraph>USER PLAN ***</Paragraph>
          {user && !user.plan ? (
            <Paragraph>No Plan</Paragraph>
          ) : user && user.plan ? (
            <Paragraph>
              {user.plan.status} - {user.plan.planId}
            </Paragraph>
          ) : (
            <Paragraph>No user</Paragraph>
          )}

          <Box gt={1}>
            <Paragraph>DEBUGGING</Paragraph>
            {status.map((item, idx) => (
              <Paragraph note key={idx + item}>
                *** {item}
              </Paragraph>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PlansScreen;
