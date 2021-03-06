import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { H2, Icon } from 'native-base';
import {
  Box,
  Container,
  Button,
  Paragraph,
  Error,
  BackButton,
  Input,
  Loading,
  LegalLinks,
  PageHeading,
} from '../primitives';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService } from 'services';
import styled from 'styled-components';
import AskParentsScreen from './AskParentsScreen';
import { deviceWidth } from 'services';
import { colors } from 'common';

const PlanSelect = styled(TouchableOpacity)`
  flex: 1;
  border-color: #999;
  border-width: 3px;
  border-radius: 8px;
  align-items: center;
  color: #999;
  padding: 20px 5px;
  margin-bottom: 20px;
  background-color: white;
`;

const Header2 = styled(H2)`
  color: ${colors.primary};
`;

// defining IAP SKUs by platform in `constants.ts`
export const IAP_SKUS = Platform.select({
  ios: ['wellemental_pro', 'wellemental_pro_year'],
  android: ['wellemental_pro', 'wellemental_pro_year'],
});

export enum PlanId {
  Monthly = 'wellemental_pro',
  Yearly = 'wellemental_pro_year',
  Free = 'free',
  Group = 'group',
}

const PlansScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentalLock, setParentalLock] = useState(true);
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
    translation['Online or offline use'],
  ];

  // Sync products from IAP, required for usage
  useEffect(() => {
    const getProducts = async () => {
      try {
        const gotProd = await RNIap.getSubscriptions(IAP_SKUS);
        setProducts(gotProd);
      } catch (err) {
        setError(
          `Unable to retrieve products. Please try again or contact support@wellemental.co`,
        );
        // logger.error(`Error retrieving Iap Products - ${err}`);
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
      setError(
        translation[
          'Account upgraded! Close this page and wait a few seconds for the app to update.'
        ],
      );
      setProcessing(false);
    } catch (err) {
      // logger.error(
      //   `Error requesting Iap Subscription - ${
      //     err && err.message ? err.message : err
      //   }`,
      // );
      setError(
        `${
          translation[
            'There was an error creating your subscription. Please try again. If problem persists, email hello@wellemental.co.'
          ]
        } ${err && err.message ? err.message : err}`,
      );
      setProcessing(false);
    }
    setProcessing(false);
  };

  // Input Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [showAccessDisplay, toggleDisplay] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handlePromoCode = async () => {
    const service = new PromoCodeService();
    try {
      await service.validateAndUpgrade(user.id, promoCode);
      setUpgrading(true);
    } catch (err) {
      setError(err);
    }
  };

  return parentalLock ? (
    <AskParentsScreen setLock={setParentalLock} />
  ) : (
    <Loading loading={upgrading}>
      <Container scrollEnabled bg="Plans">
        <BackButton float="right" close plansScreen />
        <PageHeading
          plansScreen
          title="An inclusive space for kids to breathe."
          subtitle="Spark a  mindful practice with the children in your life. Learn meditation and yoga with Wellemental."
        />

        <Box mb={2}>
          {bullets.map(bullet => (
            <Box row key={bullet} mb={0.5}>
              <Icon
                name="ios-checkmark-sharp"
                style={{ fontSize: 22, color: colors.warning }}
              />

              <Paragraph style={{ paddingHorizontal: 5 }} key={bullet}>
                {bullet}
              </Paragraph>
            </Box>
          ))}
        </Box>

        {!showAccessDisplay ? (
          <>
            <Box row justifyContent="space-evenly">
              <PlanSelect
                activeOpacity={1}
                style={{
                  marginRight: 5,
                  borderColor:
                    selectedPlan === PlanId.Monthly
                      ? colors.warning
                      : colors.lightText,
                }}
                onPress={() => setSelectedPlan(PlanId.Monthly)}>
                <Header2>{translation.Monthly}</Header2>
                <Header2>$6.99 / {translation.mo}</Header2>
                <Paragraph
                  style={{
                    color: 'white',
                  }}>
                  ***
                </Paragraph>
              </PlanSelect>

              <PlanSelect
                activeOpacity={1}
                style={{
                  marginLeft: 5,
                  borderColor:
                    selectedPlan === PlanId.Yearly
                      ? colors.warning
                      : colors.lightText,
                }}
                onPress={() => setSelectedPlan(PlanId.Yearly)}>
                <Header2>{translation.Annual}</Header2>
                <Header2>$59.99 / {translation.yr}</Header2>
                <Paragraph center>$4.58 / {translation.mo}</Paragraph>
              </PlanSelect>
            </Box>
            <Button
              primary
              disabled={loading || processing}
              loading={processing}
              text={translation.Subscribe}
              onPress={() => handleSubscription(PlanId.Monthly)}
            />
            <Box mt={1} pb={6}>
              <Error success={error.includes('succeed')} error={error} center />
              <Box mt={2}>
                <LegalLinks subs />
              </Box>
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
              text={translation.Submit}
              onPress={() => handlePromoCode()}
            />
          </>
        )}
      </Container>

      <Image
        source={require('../assets/images/grass.png')}
        style={{
          position: 'absolute',
          left: -3,
          right: 0,
          bottom: -5,
          width: deviceWidth + 3,
          height: deviceWidth * 0.16,
        }}
      />
    </Loading>
  );
};

export default PlansScreen;
