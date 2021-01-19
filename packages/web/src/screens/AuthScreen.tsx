import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Card, CardContent, Collapse } from '@material-ui/core';
import {
  Button,
  Input,
  Paragraph,
  Headline,
  Error,
  Logo,
  Spinner,
} from '../primitives';
import AuthService from '../services/AuthService';
import { Languages, Translations } from '../types';
import { useLocation, useCurrentUser } from '../hooks';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';

type Props = {
  redirect?: string | null | undefined;
  raised?: boolean;
};

const service = new AuthService();

const AuthScreen: React.FC<Props> = ({ redirect, raised }) => {
  const history = useHistory();
  const { user, loading: userLoading } = useCurrentUser();
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { state, location } = useLocation();
  const language = state && state.language;

  const isFriends = location.state.from.pathname === '/access';

  const translation: Translations =
    language && language === Languages.Es ? Español : English;

  const handleCheckEmail = async () => {
    setLoading(true);
    try {
      const existingLogins = await service.checkExistingLogins(email);
      setAuths(existingLogins);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await service.login(email, password);

      if (redirect) {
        history.push(redirect);
      } else {
        // Show regular user UI.
        history.push(isFriends ? '/access' : '/');
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);

    const newAccount = {
      email,
      password,
      language: Languages.En,
    };

    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      setLoading(false);
      return;
    }

    try {
      await service.signup(newAccount);
      setError('Success');
      history.push(isFriends ? '/access' : redirect ? redirect : '/');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  let handleStep: any = handleCheckEmail;
  const [headline, setHeadline] = useState('Enter email...');

  useEffect(() => {
    if (auths && auths.length === 0) {
      setHeadline('Create Account');
    } else if (auths && auths.length > 0) {
      setHeadline('Login');
    }
  }, [auths]);

  if (auths && auths.length === 0) {
    handleStep = handleSignup;
  } else if (auths && auths.length > 0 && password) {
    handleStep = handleLogin;
  }

  // If user is logged in & isn't currently logging in, then redirect to homepage
  if (user && !loading) {
    history.push('/');
  }

  return userLoading ? (
    <Spinner />
  ) : (
    <Box>
      <Logo linked={false} center mb={1} />
      <Card>
        <CardContent>
          <Headline center variant="h5" gutterBottom={!isFriends}>
            {headline}
          </Headline>
          {isFriends && (
            <Paragraph align="center" color="textSecondary">
              {
                translation[
                  'Please login or signup before entering your access code.'
                ]
              }
            </Paragraph>
          )}
          <Error center error={error} />
          <Input
            id="email-input"
            autoFocus
            InputProps={{ style: { fontSize: '17px' } }}
            label={translation.Email}
            type="email"
            value={email}
            onKeyPress={handleStep}
            changeState={setEmail}
          />
          <Collapse in={!!auths} timeout="auto">
            {auths && (
              <Input
                id="password-input"
                autoFocus
                label={translation.Password}
                type="password"
                value={password}
                autoComplete="current-password"
                onKeyPress={handleStep}
                onChange={(e) => setPassword(e.target.value && e.target.value)}
              />
            )}
          </Collapse>
          <Box mt={3} mb={3}>
            <Button
              fullWidth
              disabled={!email}
              loading={loading}
              onClick={handleStep}
              type="submit"
              text={translation.Submit}
            />
          </Box>

          <Button
            onClick={() => history.push('/forgot-password', { translation })}
            variant="text"
            size="small"
            style={{ color: '#999' }}
            fullWidth
            text={translation['Forgot password?']}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthScreen;
