import React, { useState, MouseEvent, useEffect } from 'react';
import {
  Box,
  Button,
  Paragraph,
  Headline,
  Error,
  Input,
  Spinner,
  LegalLinks,
  PageHeading,
} from '../primitives';
import { useLead, useHistory } from '../hooks';
import Link from '@material-ui/core/Link';
import { Check as CheckIcon } from '@material-ui/icons';
import { useCurrentUser } from '../hooks';
import { PromoCodeService } from '../services';
import { brandColors } from '../assets/styles/theme';

export enum PlanId {
  Monthly = 'wellemental_pro',
  Yearly = 'wellemental_pro_year',
  Free = 'free',
  Group = 'group',
}

const PlansScreen: React.FC = () => {
  const { auth, translation, activePlan } = useCurrentUser();
  const [error, setError] = useState('');

  // Plan Selection
  const { plan, setPlan } = useLead();
  const history = useHistory();
  const availPlans = ['monthly', 'yearly'];
  const [pickedPlan, pickPlan] = useState<string>(
    plan ? plan.id : availPlans[0],
  );

  if (activePlan) {
    history.push('/library');
  }

  const selectPlan = (event: MouseEvent<HTMLElement>, newPlan: string) => {
    pickPlan(newPlan);
  };

  useEffect(() => {
    if (pickedPlan) {
      setPlan(pickedPlan);
    }
  }, [pickedPlan]);

  const bullets = [
    translation['100+ meditation and yoga videos'],
    translation['Available in English and Spanish'],
    translation['Led by diverse teachers'],
    translation['Save your favorite videos'],
    translation['Online or offline use'],
  ];

  // Handle new subscription request
  // const handleSubscription = async (plan: PlanId) => {
  //   setSelectedPlan(plan);
  //   try {
  //     setError('');
  //   } catch (err) {
  //     setError(err);
  //   }
  // };

  // Input Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [showAccessDisplay, toggleDisplay] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handlePromoCode = async () => {
    const service = new PromoCodeService();
    try {
      await service.validateAndUpgrade(auth.uid, promoCode);
      setUpgrading(true);
    } catch (err) {
      setError(err);
    }
  };
  //
  return upgrading ? (
    <Spinner text={translation['One moment...']} />
  ) : (
    <Box
      style={{
        flex: 1,
      }}>
      <Box>
        {/* <Box mt={2}>
          <Button
            fullWidth
            style={{
              marginBottom: '-30px',
            }}
            color="secondary"
            variant="text"
            text={
              showAccessDisplay
                ? translation['New account?']
                : translation['Access code?']
            }
            onClick={() => toggleDisplay(!showAccessDisplay)}
          />
        </Box> */}

        <PageHeading
          title={translation['An inclusive space for kids to breathe.']}
          subtitle={
            translation[
              'Spark a mindful practice with the children in your life. Learn meditation and yoga with Wellemental.'
            ]
          }
        />

        <Box mb={2}>
          {bullets.map((bullet) => (
            <Box display="flex" flexDirection="row" key={bullet} mb={0.5}>
              <CheckIcon
                style={{ color: brandColors.brandWarning, marginRight: '5px' }}
              />

              <Paragraph key={bullet}>{bullet}</Paragraph>
            </Box>
          ))}
        </Box>

        {!showAccessDisplay ? (
          <>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              mb={2}>
              <Link
                underline="none"
                onClick={(e: MouseEvent<HTMLElement>) =>
                  selectPlan(e, 'monthly')
                }
                style={{
                  marginRight: 5,
                  borderColor:
                    pickedPlan === 'monthly'
                      ? brandColors.brandWarning
                      : brandColors.lightTextColor,
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderRadius: '6px',
                  width: '48%',
                  padding: '15px',
                }}>
                <Headline center variant="h5">
                  {translation.Monthly}
                </Headline>
                <Paragraph center color="primary">
                  $6.99 / {translation.mo}
                </Paragraph>
                <Paragraph
                  center
                  style={{
                    color: 'rgba(0,0,0,0)',
                  }}>
                  ***
                </Paragraph>
              </Link>

              <Link
                underline="none"
                onClick={(e: MouseEvent<HTMLElement>) =>
                  selectPlan(e, 'yearly')
                }
                style={{
                  borderColor:
                    pickedPlan === 'yearly'
                      ? brandColors.brandWarning
                      : brandColors.lightTextColor,
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderRadius: '6px',
                  width: '48%',
                  padding: '15px',
                }}>
                <Headline center variant="h5">
                  {translation.Annual}
                </Headline>
                <Paragraph center color="primary">
                  $59.99 / {translation.yr}
                </Paragraph>
                <Paragraph fine center>
                  $4.58 / {translation.mo}
                </Paragraph>
              </Link>
            </Box>
            <Button
              fullWidth
              onClick={() => history.push('/checkout')}
              text={translation.Subscribe}
            />
            <Box mt={3}>
              <LegalLinks subs />
            </Box>
          </>
        ) : (
          <>
            <Input
              label={translation['Access code']}
              value={promoCode}
              autoFocus
              // onChange={setPromoCode}
              changeState={setPromoCode}
              onKeyPress={() => handlePromoCode()}
              autoCapitalize="none"
              // autoCorrect={false}
            />
            <Box my={2}>
              <Button
                fullWidth
                // disabled={processing}
                text={translation.Submit}
                onClick={() => handlePromoCode()}
              />
            </Box>
          </>
        )}

        <Error error={error} />

        {/* </ImageBackground> */}
        {/* <Image
        source={require('../assets/images/grass.png')}
        style={{
          position: 'absolute',
          left: -3,
          right: 0,
          bottom: 0,
          width: deviceWidth + 3,
          height: deviceWidth * 0.16,
        }}
      /> */}
      </Box>
    </Box>
  );
};

export default PlansScreen;
