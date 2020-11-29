import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Card, CardContent, Collapse } from '@material-ui/core';
import { Button, Input, Paragraph, Headline, Error, Page } from '../primitives';
import AuthService from '../services/AuthService';
import { Languages } from '../types';
// import moment from 'moment';
// import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
// import MomentUtils from '@date-io/moment';
// import logger from '../services/LoggerService';
// import { fireFbEvent, fireGaEvent } from '../services/AnalyticsService';

type Props = {
  redirect?: string | null | undefined;
  raised?: boolean;
};

const service = new AuthService();

const AuthScreen: React.FC<Props> = ({ redirect, raised }) => {
  const history = useHistory();
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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
        history.push('/access-code');
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
      history.push(redirect ? redirect : '/access-code');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  // const handleSignup = useCallback(async () => {
  //   setLoading(true);

  //   if (password.length < 7) {
  //     setError('Password must be at least 7 characters long.');
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     await firebase.auth().createUserWithEmailAndPassword(email, password);

  //     history.push(redirect ? redirect : '/access-code');
  //   } catch (err) {
  //     //   logger.error(`Unable to Signup from website – ${err}`);
  //     setError(err);
  //     setLoading(false);
  //   }
  // }, [history, email, password, redirect]);

  let handleStep: any = handleCheckEmail;
  let headline: string = 'Enter email...';
  // let step: string = 'verifyEmail';

  if (auths && auths.length === 0) {
    // step = 'signup';
    handleStep = handleSignup;
    headline = 'Create Account';
  } else if (auths && auths.length > 0 && password) {
    // step = 'login';
    handleStep = handleLogin;
    headline = 'Login';
  }

  return (
    <Page>
      <Card elevation={0}>
        <CardContent>
          <Paragraph align="center" color="textSecondary">
            Friends &amp; Family
          </Paragraph>
          <Headline align="center" variant="h5" gutterBottom>
            {headline}
          </Headline>
          <Input
            id="email-input"
            autoFocus
            label="Email"
            type="email"
            mt={5}
            value={email}
            onKeyPress={handleStep}
            changeState={setEmail}
          />
          <Collapse in={!!auths} timeout="auto">
            {auths && (
              <Input
                id="password-input"
                autoFocus
                label="Password"
                type="password"
                value={password}
                autoComplete="current-password"
                onKeyPress={handleStep}
                onChange={(e) => setPassword(e.target.value && e.target.value)}
              />
            )}
          </Collapse>
          <Box mt={3}>
            <Button
              fullWidth
              disabled={!email}
              loading={loading}
              onClick={handleStep}
              type="submit"
              text="Submit"
            />
          </Box>

          <Box mt={2}>
            <Error error={error} />
          </Box>
        </CardContent>
      </Card>
    </Page>
  );
};

export default AuthScreen;
