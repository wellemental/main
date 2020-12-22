import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import { Button, Error, Spinner, Page } from '../primitives';
import app from '../base';
import logger from '../services/LoggerService';
import { useCurrentUser } from '../hooks';
import { History } from 'history';
import { Redirect } from 'react-router-dom';

interface Props {
  history: History;
}

const AccountScreen: React.FC<Props> = ({ history }) => {
  const { user, translation } = useCurrentUser();
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const getLink = async () => {
      setRedirecting(true);
      await app
        .functions()
        .httpsCallable('onGetBillingPortal')()
        .then((res) => {
          window.location.href = res.data.url;
        })
        .catch((err) => {
          logger.error(`Error getting billing portal`);

          setError(
            'There was an error retrieving your subscription portal. Please try again. If problem persists, email hello@mentalhealthleague.com.',
          );
          setRedirecting(false);
        });
    };
    getLink();
  }, []);

  return redirecting ? (
    <Spinner text={translation['One moment...']} />
  ) : error ? (
    <Page>
      <Card>
        <Typography variant="h4" align="center" gutterBottom>
          Error
        </Typography>
        <Error error={error} />
      </Card>
    </Page>
  ) : user && !user.stripeId ? (
    <Page>
      <Card>
        <Typography variant="h4" align="center" gutterBottom>
          Subscription
        </Typography>

        <Typography gutterBottom>
          You don't have an active Wellemental subscription. Subscribe now!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          onClick={() => history.push('/checkout')}>
          Checkout
        </Button>
      </Card>
    </Page>
  ) : (
    <Redirect
      to={{
        pathname: '/login',
      }}
    />
  );
};

export default AccountScreen;
