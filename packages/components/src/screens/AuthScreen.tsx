import React, { useState } from 'react';
import { AuthService, Languages } from 'services';
import {
  Container,
  PageHeading,
  Button,
  Input,
  Error,
  Box,
  LegalLinks,
} from '../primitives';
import moment from 'moment';
import { AuthScreenRouteProp, Translations } from '../types';
import { English } from '../translations/en.js';
import { Español } from '../translations/es.js';
import { useNavigation } from '@react-navigation/native';

type Props = {
  route: AuthScreenRouteProp;
};

const AuthScreen: React.FC<Props> = ({ route }) => {
  // Import and save language selection to AsyncStorage
  const navigation = useNavigation();
  const { language } = route.params;
  const translation: Translations =
    language === Languages.Es ? Español : English;

  // Manage State
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  // const minBirthday = moment().subtract(13, 'years').toDate();
  // const [birthday, setBirthday] = useState<Date>(minBirthday);

  const service = new AuthService();

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
      // birthday: moment(birthday).format('YYYY-MM-DD'),
      language,
      name,
    };

    if (password.length < 7) {
      setError(translation['Password must be at least 7 characters long.']);
      setLoading(false);
      return;
    }

    // if (birthday > minBirthday) {
    //   setError(translation['You are not old enough to join Wellemental.']);
    //   setEmail('');
    //   setPassword('');
    //   setAuths(null);
    //   setLoading(false);
    //   return;
    // }

    try {
      await service.signup(newAccount);
      setError('Success');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  let handleStep: () => void = handleCheckEmail;

  if (auths && auths.length === 0) {
    handleStep = handleSignup;
  } else if (auths && auths.length > 0 && password) {
    handleStep = handleLogin;
  }

  return (
    <Container scrollEnabled>
      <PageHeading title={translation.Login} />

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
        <>
          <Input
            autoFocus
            secureTextEntry={true}
            label={translation.Password}
            value={password}
            onChangeText={setPassword}
          />

          {auths && auths.length === 0 && (
            <>
              {/* <Input
                label={translation.Username}
                value={name}
                onChangeText={setName}
              /> */}
              {/* <DatePicker
                date={moment().subtract(13, 'years').toDate()}
                onDateChange={setBirthday}
                translation={translation}
                locale={language === Languages.Es ? 'es' : 'en'}
              /> */}

              <LegalLinks />
            </>
          )}
        </>
      )}
      <Button
        warning={language === Languages.Es}
        text={translation.Submit}
        loading={loading}
        onPress={handleStep}
      />
      <Box gt>
        <Button
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
