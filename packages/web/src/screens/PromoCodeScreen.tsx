import React, { useState } from 'react';
import { Card, CardContent } from '@material-ui/core';
import { Button, Page, Headline, Paragraph, Error, Input } from '../primitives';
import PromoCodeService from '../services/PromoCodeService';
import { Redirect } from 'react-router-dom';
import { useHistory, useCurrentUser } from '../hooks';

const PromoCodeScreen: React.FC = () => {
  const [error, setError] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [upgrading, setUpgrading] = useState(false);
  const { auth, translation } = useCurrentUser();
  const history = useHistory();

  const handlePromoCode = async () => {
    const service = new PromoCodeService();

    try {
      setUpgrading(true);
      await service.validateAndUpgrade(auth.uid, promoCode);
      history.push('/download');
    } catch (err) {
      setError(err);
      setUpgrading(false);
    }
  };

  return !auth ? (
    <Redirect
      to={{
        pathname: '/login',
      }}
    />
  ) : (
    <Page>
      <Card>
        <CardContent>
          {auth && (
            <Paragraph align="center" color="textSecondary">
              {auth.email}
            </Paragraph>
          )}
          <Headline align="center" variant="h5" gutterBottom>
            {translation['Enter Access Code']}
          </Headline>

          <Error error={error} />

          <Input
            mb={3}
            id="access-code"
            autoFocus
            label={translation['Access code']}
            onKeyPress={handlePromoCode}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value && e.target.value)}
          />

          <Button
            disabled={upgrading}
            text={translation['Submit']}
            fullWidth
            onClick={handlePromoCode}
          />
        </CardContent>
      </Card>
    </Page>
  );
};

export default PromoCodeScreen;
