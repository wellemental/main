import React, { useState } from 'react';
import { Card, Typography, Divider } from '@material-ui/core';
import { Button, Error, Box, Headline, Paragraph } from '../primitives';
import { useCurrentUser, useHistory } from '../hooks';
import { Redirect } from 'react-router-dom';

const SubscriptionScreen: React.FC = () => {
  const { user, auth, translation, activePlan } = useCurrentUser();
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(true);
  const history = useHistory();

  return error ? (
    <Card>
      <Typography variant="h4" align="center" gutterBottom>
        Error
      </Typography>
      <Error error={error} />
    </Card>
  ) : user ? (
    <Box mt={4}>
      <Card>
        <Headline variant="h4" align="center" gutterBottom>
          {translation['Subscription']}
        </Headline>

        {!user.plan ? (
          <>
            <Typography gutterBottom>
              You don't have an active Wellemental subscription. Subscribe
              below! If you have any issues, email us at hello@wellemental.co
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              size="large"
              onClick={() => history.push('/plans')}>
              {translation['View Plans']}
            </Button>
          </>
        ) : (
          <>
            <Paragraph>
              <b>Email:</b> {auth.email}
            </Paragraph>
            <Paragraph>
              <b>Payment Type:</b>{' '}
              {user.plan.type === 'iosIap'
                ? 'Apple iOS'
                : user.plan.type === 'stripe'
                ? 'Website (Stripe)'
                : user.plan.type === 'promoCode'
                ? 'Promo Code'
                : 'N/A'}
            </Paragraph>
            {user.plan.planId && (
              <Paragraph>
                <b>Plan</b>: {user.plan.planId}
              </Paragraph>
            )}

            {user.plan.code && (
              <Paragraph>
                <b>Promo Code</b>: {user.plan.code}
              </Paragraph>
            )}

            <Box my={2}>
              <Divider />
            </Box>

            <Headline variant="h6">
              {translation['Manage Subscription']}
            </Headline>
          </>
        )}

        {user.plan.type === 'stripe' ? (
          <>
            <Paragraph gutterBottom>
              To manage your subscription, please click the button below.
            </Paragraph>
            <Button
              onClick={() => history.push('/stripe')}
              text="Manage Subscription"
            />
          </>
        ) : user.plan.type === 'iosIap' ? (
          <>
            <Paragraph gutterBottom>
              To manage your subscription, you need to use your Apple iOS device
              and follow the instructions below.
            </Paragraph>
            <ol>
              <li>{translation['Open the Settings app.']}</li>
              <li>{translation['Tap your name.']}</li>
              <li>{translation['Tap Subscriptions.']}</li>
              <li>
                {translation['Tap the subscription that you want to manage.']}
              </li>
              <li>{translation['Tap Cancel Subscription.']}</li>
            </ol>
          </>
        ) : user.plan.type === 'promoCode' ? (
          <Typography gutterBottom>
            You subscribed for free using an friends and family access code.
            Enjoy!
          </Typography>
        ) : (
          <Typography gutterBottom>
            Subscription type unknown. Please contact us at hello@wellemental.co
            with any questions.
          </Typography>
        )}
      </Card>

      <Box mt={2}>
        <Paragraph center color="textSecondary">
          <b>Need help?</b> Email hello@wellemental.co
        </Paragraph>
      </Box>
    </Box>
  ) : (
    <Redirect
      to={{
        pathname: '/login',
      }}
    />
  );
};

export default SubscriptionScreen;
