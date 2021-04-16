import React, { useEffect, useState } from 'react';
import { Card, Typography } from '@material-ui/core';
import { Button, Error, Loading, Page } from '../primitives';
import app from '../base';
import logger from '../services/LoggerService';
import { useCurrentUser } from '../hooks';
import { History } from 'history';
import { Redirect } from 'react-router-dom';

interface Props {
  history: History;
}

const StripePortal: React.FC<Props> = ({ history }) => {
  const { user, translation } = useCurrentUser();
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const getLink = async () => {
      setRedirecting(true);
      await app
        .functions()
        .httpsCallable('onGetBillingPortal')()
        .then(res => {
          window.location.href = res.data.url;
        })
        .catch(err => {
          logger.error(`Error getting billing portal`);

          setError(
            'There was an error retrieving your subscription portal. Please try again. If problem persists, email hello@wellemental.co.',
          );
          setRedirecting(false);
        });
    };
    getLink();
  }, []);

  return redirecting ? (
    <Loading fullPage loading={true} text={translation['One moment...']} />
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
          {translation.Subscription}
        </Typography>

        <Typography gutterBottom>
          {
            translation[
              "You don't have an active Wellemental subscription. Subscribe now!"
            ]
          }
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          size="large"
          onClick={() => history.push('/plans')}>
          {translation['View Plans']}
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

export default StripePortal;
