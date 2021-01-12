import React, { useState } from 'react';
import { Button, Error, Headline, Input, Box, Paragraph } from '../primitives';
import { ForgotPasswordService } from '../services';
import { useCurrentUser, useHistory } from '../hooks';
import { Card, CardContent } from '@material-ui/core';

const ForgotPasswordScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isReset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePressForgotPassword = async (): Promise<void> => {
    if (error) {
      setError('');
    }
    setLoading(true);
    const service = new ForgotPasswordService();
    try {
      await service.perform(email);
      setReset(true);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
    return Promise.resolve();
  };

  return (
    <Box>
      <Card elevation={0}>
        <CardContent>
          <Headline align="center" variant="h5" gutterBottom>
            {translation['Forgot password?']}
          </Headline>
          <Error error={error} />
          {isReset ? (
            <Paragraph>
              {translation['Check your email for a reset password link.']}
            </Paragraph>
          ) : (
            <>
              <Box mb={3}>
                <Input
                  label={translation.Email}
                  value={email}
                  autoCapitalize="none"
                  autoFocus
                  changeState={setEmail}
                  onKeyPress={handlePressForgotPassword}
                />
              </Box>

              <Box mb={3}>
                <Button
                  loading={loading}
                  onClick={handlePressForgotPassword}
                  text={translation['Reset Password']}
                />
              </Box>
              <Button
                onClick={() => history.push('/login', { translation })}
                variant="text"
                size="small"
                style={{ color: '#999' }}
                text={translation['Back to Login']}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordScreen;
