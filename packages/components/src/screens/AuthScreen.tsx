import React, { useState, useEffect } from 'react';
import { AuthService } from 'services';
import {
  Container,
  PageHeading,
  Button,
  Input,
  Error,
  Box,
  LegalLinks,
} from '../primitives';
import { AuthScreenRouteProp } from '../types';
import { English, Español, Translation, Languages } from 'common';
import { useNavigation } from '@react-navigation/native';

type Props = {
  route: AuthScreenRouteProp;
};

const service = new AuthService();

const AuthScreen: React.FC<Props> = ({ route }) => {
  // Get langauge from navigation params
  const navigation = useNavigation();
  const { language } = route.params;

  const translation: Translation =
    language === Languages.Es ? Español : English;

  // Manage State
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

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
      language,
    };

    if (password.length < 7) {
      setError(translation['Password must be at least 7 characters long.']);
      setLoading(false);
      return;
    }

    try {
      await service.signup(newAccount);
      setError('Success');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  let handleStep: () => void = handleCheckEmail;
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

  return (
    <Container scrollEnabled>
      <PageHeading title={translation[headline]} />

      <Input
        label={translation.Email}
        keyboard="email-address"
        value={email}
        autoFocus
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCompleteType="email"
        autoCorrect={false}
      />

      {auths && (
        <Input
          autoFocus
          secureTextEntry={true}
          label={translation.Password}
          value={password}
          onChangeText={setPassword}
        />
      )}
      <Button
        warning={language === Languages.Es}
        text={translation.Submit}
        loading={loading}
        onPress={handleStep}
      />
      <Box mt={3}>
        {auths && auths.length === 0 && (
          <LegalLinks translation={translation} />
        )}
        <Button
          small
          transparent
          text={translation['Forgot password?']}
          loading={loading}
          onPress={() =>
            navigation.navigate('Forgot Password', { translation })
          }
        />
      </Box>

      <Error center error={error} />
    </Container>
  );
};

export default AuthScreen;
