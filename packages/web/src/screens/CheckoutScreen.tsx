import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement, StripeCardElementOptions } from '@stripe/stripe-js';
import { Input, Button, SupportEmail } from '../primitives';
import { useCurrentUser, useHistory, useLead } from '../hooks';
import app from '../base';
import logger from '../services/LoggerService';
import { theme } from '../assets/styles/theme';
// import { fireFbEvent, fireGaEvent } from '../services/AnalyticsService';
import {
  Box,
  Card,
  InputAdornment,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Lock as LockIcon } from '@material-ui/icons';

const CheckoutScreen: React.FC = () => {
  const history = useHistory();
  const { auth } = useCurrentUser();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { plan } = useLead();
  // const [planId] = useState<string | undefined>(plan.stripeId);

  const stripe = useStripe();
  const elements = useElements();

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
            trial_period_days: plan.trialLength,
          })
          .then((res) => {
            // fireFbEvent('StartTrial', {
            //   value: plan.price,
            //   currency: 'USD',
            // });

            // fireGaEvent('User', 'Start Trial');

            history.push(`/download`);
          })
          .catch((err) => {
            logger.error(`Error starting subscription - ${err}`);
            setError(
              'There was an error creating your subscription. Please try again. If problem persists, email hello@wellemental.co.',
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
        // fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
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
        <Typography align="center" variant="h4">
          Checkout
        </Typography>
        <Typography align="center" color="textSecondary" component="p">
          100% Satisfaction Guarantee. Cancel anytime.
        </Typography>
        {auth && auth.email && (
          <Typography
            align="center"
            variant="caption"
            color="textSecondary"
            component="p">
            {auth.email}
          </Typography>
        )}
      </Box>
      <TableContainer component={Paper} square>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                Payment
              </TableCell>
              <TableCell align="right">${plan.price}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Card square>
        {error && <Typography color="secondary">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          {auth && !auth.email && (
            <Box mb={4} mt={2}>
              <Input
                id="email-input"
                label="Email"
                type="email"
                variant="outlined"
                box={'mt={5}'}
                value={auth ? auth.email : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          )}

          <Box mb={1} mt={2}>
            <Box mb={2}>
              <Typography variant="subtitle2" component="span">
                Enter payment info...
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
              onClick={(e) => handleSubmit(e)}
              type="submit"
              disabled={loading}
              loading={loading}
              variant="contained"
              color="secondary"
              fullWidth
              text="Submit Payment"
            />
          </Box>
        </form>
        {/* <Box mt={2}>
          <Button
            onClick={handleCancel}
            type="submit"
            disabled={loading}
            variant="contained"
            color="secondary"
            fullWidth
            size="large">
            Cancel Subscription
          </Button>
        </Box> */}
      </Card>

      <Box mx={2}>
        <SupportEmail />
      </Box>
    </Box>
  );
};

export default CheckoutScreen;
