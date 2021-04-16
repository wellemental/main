import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement, StripeCardElementOptions } from '@stripe/stripe-js';
import {
  Input,
  Button,
  SupportEmail,
  Icon,
  Headline,
  Paragraph,
  Error,
} from '../primitives';
import { scrollToTop } from '../services/helpers';
import { useCurrentUser, useHistory, useLead } from '../hooks';
import app from '../base';
import logger from '../services/LoggerService';
import { fireFbEvent, fireGaEvent } from '../services/PixelEventService';
import { theme } from '../assets/styles/theme';
import { Box, Card } from '../primitives';
import {
  InputAdornment,
  Typography,
  IconButton,
  Collapse,
  CircularProgress,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const promoCodes = ['MMOVE', 'ZIA', 'BRANDON', 'YAHEL', 'FLOR', 'NICOLE'];

const CheckoutScreen: React.FC = () => {
  const history = useHistory();
  const { user, translation } = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { plan } = useLead();

  const stripe = useStripe();
  const elements = useElements();

  // Handle promo code functionality
  const [promoCode, setPromoCode] = useState('');
  const [activePromoCode, setActivePromoCode] = useState<null | string>(null);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoReject, setPromoReject] = useState('');
  const [trialLength, setTrialLength] = useState(plan.trialLength);

  const validatePromoCode = () => {
    if (promoCodes.includes(promoCode)) {
      setActivePromoCode(promoCode);
      setTrialLength(30);
      setShowPromoCode(false);
      scrollToTop();
    } else {
      setPromoReject(translation['Invalid promo code']);
    }
  };

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      logger.error('Stripe not loading');
      return;
    }

    const cardElement: StripeCardElement | null = elements.getElement(
      CardElement,
    );

    if (cardElement) {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        setError(
          'Error occurred. Please try again. If problem persists, email hello@wellemental.co',
        );
        setLoading(false);
      }

      if (token) {
        await app
          .functions()
          .httpsCallable('onStartSubscription')({
            source: token.id,
            plan: plan.stripeId,
            trial_period_days: trialLength,
          })
          .then(res => {
            fireFbEvent('Purchase', {
              value: plan.price,
              currency: 'USD',
            });

            fireGaEvent('User', 'Purchase');
            history.push(`/download`);
          })
          .catch(err => {
            logger.error(`Error starting subscription - ${err}`);
            setError(
              translation[
                'There was an error creating your subscription. Please try again. If problem persists, email hello@wellemental.co.'
              ],
            );
            setLoading(false);
          });
      }
    }
  };

  const CARD_OPTIONS: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: theme.palette.secondary.main,
        fontWeight: '500',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': { color: '#999' },
        '::placeholder': { color: '#999' },
      },
      invalid: {
        // iconColor: '#ffc7ee',
        color: theme.palette.secondary.main,
      },
    },
  };

  const [stripeLoading, setStripeLoading] = useState(true);

  return (
    <Box>
      <Box mb={3} mx={2} mt={4}>
        <Headline center>{translation.Checkout}</Headline>
        <Paragraph small center color="textSecondary">
          {translation['100% Satisfaction Guarantee. Cancel anytime.']}
        </Paragraph>
        {user && user.email && (
          <Paragraph fine center color="textSecondary">
            {user.email}
          </Paragraph>
        )}
      </Box>
      {activePromoCode && (
        <Box mb={1}>
          <Error
            center
            error={`${activePromoCode} ${translation['applied. 30 day free trial added.']}`}
          />
        </Box>
      )}
      <Collapse in={!!activePromoCode} timeout="auto">
        <TableContainer component={Paper} square elevation={0}>
          <Table aria-label="simple table">
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" component="span">
                  {translation['Amount Paid Now']}
                </Typography>
              </TableCell>
              <TableCell align="right">$0</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" component="span">
                  {translation['Free Trial Length']}
                </Typography>
              </TableCell>
              <TableCell align="right">{trialLength}</TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Collapse>
      <TableContainer component={Paper} square>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" component="span">
                  {plan.id === 'yearly'
                    ? translation['Annual Payment']
                    : translation['Monthly Payment']}
                </Typography>
              </TableCell>
              <TableCell align="right">${plan.price}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={1}>
        <Card padded square>
          {error && <Error error={error} />}

          <form onSubmit={handleSubmit}>
            <Box mb={1}>
              <Box mb={1}>
                <Typography variant="subtitle2" component="span">
                  {translation['Enter payment info']}...
                </Typography>
                {stripeLoading && <CircularProgress size={18} />}
              </Box>
              <CardElement
                options={CARD_OPTIONS}
                onReady={(element: StripeCardElement) => {
                  setStripeLoading(false);
                  element.focus();
                }}
                // onFocus={() => }
              />
            </Box>
            <Box mt={3} mb={2}>
              <Button
                onClick={e => handleSubmit(e)}
                type="submit"
                disabled={loading}
                loading={loading}
                variant="contained"
                color="secondary"
                fullWidth
                text={translation.Subscribe}
              />
            </Box>
            <Button
              onClick={() => setShowPromoCode(!showPromoCode)}
              text={translation['Promo code?']}
              size="small"
              fullWidth
              variant="text"
            />
          </form>
        </Card>
      </Box>

      <Collapse in={showPromoCode} timeout="auto">
        <Box mt={1}>
          <Card padded square>
            <Typography variant="subtitle2" component="span">
              {translation['Enter promo code']}...
            </Typography>
            <Error error={promoReject} />
            <Input
              id="promo-code"
              autoFocus
              InputLabelProps={{
                style: { fontSize: '12px' },
              }}
              mt={1}
              InputProps={{
                style: { fontSize: '15px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="submit promo code"
                      onClick={validatePromoCode}
                      onMouseDown={validatePromoCode}>
                      <Icon name="chevron-right" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              label={translation['Promo code']}
              value={promoCode}
              onKeyPress={validatePromoCode}
              changeState={setPromoCode}
              variant="filled"
            />
          </Card>
        </Box>
      </Collapse>

      <Box mx={2} mb={3}>
        <SupportEmail />
      </Box>
    </Box>
  );
};

export default CheckoutScreen;
