import React, { useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Button, Page, Headline, Paragraph, Error, Input } from '../primitives';
import PromoCodeService from '../services/PromoCodeService';
import { Redirect } from 'react-router-dom';
import { useHistory, useCurrentUser } from '../hooks';

const DownloadScreen: React.FC = () => {
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const { auth } = useCurrentUser();
  const history = useHistory();

  const handlePromoCode = async () => {
    const service = new PromoCodeService();

    if (auth && auth.uid) {
      try {
        setUpgrading(true);
        await service.validateAndUpgrade(auth.uid, promoCode);
        history.push('/download');
      } catch (err) {
        setError(err);
      }
    } else {
      setError('Please login first');
    }
  };

  return !auth ? (
    <Redirect
      to={{
        pathname: '/',
      }}
    />
  ) : (
    <Page>
      <Card elevation={0}>
        <CardContent>
          {auth && (
            <Paragraph align="center" color="textSecondary">
              {auth.email}
            </Paragraph>
          )}
          <Headline align="center" variant="h5" gutterBottom>
            Enter Access Code
          </Headline>

          <Error error={error} />

          <Input
            mb={3}
            id="access-code"
            autoFocus
            label="Access Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value && e.target.value)}
          />

          <Button
            disabled={upgrading}
            text="Submit"
            fullWidth
            onClick={handlePromoCode}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default DownloadScreen;
