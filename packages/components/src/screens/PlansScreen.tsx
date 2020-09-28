import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { H2 } from 'native-base';
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
import styled from 'styled-components';
import variables from '../assets/native-base-theme/variables/wellemental';

const PlanSelect = styled(TouchableOpacity)`
  flex: 1;
  border-color: #999;
  border-width: 1px;
  border-radius: 8px;
  align-items: center;
  color: #999;
  padding: 20px;
  margin-bottom: 20px;
`;

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
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(IAP_SKUS[0]);
  const {
    processing,
    setProcessing,
    status,
    error: iapError,
    activePlan,
  } = useIap();

  const bullets = [
    translation['100+ meditation and yoga videos'],
    translation['Available in English and Spanish'],
    translation['Led by diverse teachers'],
    translation['Save your favorite videos'],
    translation['Save for offline use'],
  ];

  useEffect(() => {
    const getProducts = async () => {
      try {
        const gotProd = await RNIap.getSubscriptions(IAP_SKUS);
        setProducts(gotProd);
      } catch (err) {
        setError(
          `Unable to retrieve products. Please try again or contact support@wellemental.co`,
        );
        logger.error(`Error retrieving Iap Products - ${err}`);
      }
      setLoading(false);
    };

    getProducts();
  }, [setProcessing]);

  // handle new subscription request
  const handleSubscription = async (plan: PlanId) => {
    setSelectedPlan(plan);
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
          <Paragraph style={{ paddingHorizontal: 5 }} key={bullet}>
            * {bullet}
          </Paragraph>
        ))}
      </Box>

      {!showAccessDisplay ? (
        <>
          <Box row justifyContent="space-evenly">
            <PlanSelect
              style={{
                marginRight: 5,
                borderColor:
                  selectedPlan === PlanId.Monthly
                    ? variables.brandPrimary
                    : variables.lightTextColor,
              }}
              onPress={() => setSelectedPlan(PlanId.Monthly)}>
              <H2
                style={{
                  color:
                    selectedPlan === PlanId.Monthly
                      ? variables.brandPrimary
                      : variables.lightTextColor,
                }}>
                {translation.Monthly}
              </H2>
              <H2
                style={{
                  color:
                    selectedPlan === PlanId.Monthly
                      ? variables.brandPrimary
                      : variables.lightTextColor,
                }}>
                $5.99 / mo
              </H2>
              <Paragraph
                style={{
                  color: 'white',
                }}>
                ***
              </Paragraph>
            </PlanSelect>

            <PlanSelect
              style={{
                marginLeft: 5,
                borderColor:
                  selectedPlan === PlanId.Yearly
                    ? variables.brandPrimary
                    : variables.lightTextColor,
              }}
              onPress={() => setSelectedPlan(PlanId.Yearly)}>
              <H2
                style={{
                  color:
                    selectedPlan === PlanId.Yearly
                      ? variables.brandPrimary
                      : variables.lightTextColor,
                }}>
                {translation.Annual}
              </H2>
              <H2
                style={{
                  color:
                    selectedPlan === PlanId.Yearly
                      ? variables.brandPrimary
                      : variables.lightTextColor,
                }}>
                $4.58 / mo
              </H2>
              <Paragraph
                style={{
                  color:
                    selectedPlan === PlanId.Yearly
                      ? variables.brandPrimary
                      : variables.lightTextColor,
                }}>
                $59.99 / year
              </Paragraph>
            </PlanSelect>
          </Box>
          <Button
            primary
            disabled={loading || processing}
            loading={processing}
            text={translation['Subscribe']}
            onPress={() => handleSubscription(PlanId.Monthly)}
          />
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

      {/* <Error error={error} center /> */}

      {auth && auth.email === 'mike.r.vosters@gmail.com' && status && (
        <Box gt={2}>
          <Paragraph>IAP Error Msg:</Paragraph>
          <Error error={iapError} center />
          <Paragraph>******</Paragraph>
          <Paragraph>SELECTED PLAN</Paragraph>
          <Paragraph>{selectedPlan}</Paragraph>
          <Paragraph>******</Paragraph>
          <Paragraph>IAP ACTIVE PLAN</Paragraph>
          <Paragraph>{activePlan}</Paragraph>
          <Paragraph>******</Paragraph>
          <Paragraph>USER PLAN</Paragraph>
          {user && !user.plan ? (
            <Paragraph>No Plan</Paragraph>
          ) : user && user.plan ? (
            <Paragraph>
              {user.plan.staatus} - {user.plan.planId}
            </Paragraph>
          ) : (
            <Paragraph>No user</Paragraph>
          )}

          <Box gt={1}>
            <Paragraph>******</Paragraph>
            <Paragraph>DEBUGGING</Paragraph>
            {status.map((item, idx) => (
              <Paragraph note key={idx + item}>
                *{item}
              </Paragraph>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PlansScreen;
