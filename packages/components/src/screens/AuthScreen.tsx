import React, { useState } from 'react';
import { AuthService } from 'services';
import { DatePicker } from 'native-base';
import { Container, Paragraph, Button, Input, Error } from '../primitives';
import moment from 'moment';

const LoginScreen: React.FC = () => {
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const minBirthday = moment().subtract(13, 'years').toDate();
  const [birthday, setBirthday] = useState<Date>(minBirthday);

  const service = new AuthService();

  const handleCheckEmail = async () => {
    setLoading(true);
    try {
      const existingLogins = await service.checkExistingLogins(email);
      setAuths(existingLogins);
    } catch (err) {
      setError('Error. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await service.login(email, password);
    } catch (err) {
      setError('Did not work');
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);

    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      setLoading(false);
      return;
    }

    if (birthday > minBirthday) {
      setError('You are not old enough to join Wellemental.');
      setEmail('');
      setPassword('');
      setAuths(null);
      setLoading(false);
      return;
    }

    try {
      await service.signup(email, password);
      setError('Success');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  let handleStep: any = handleCheckEmail;

  if (auths && auths.length === 0) {
    // step = 'signup';
    handleStep = handleSignup;
  } else if (auths && auths.length > 0 && password) {
    // step = 'login';
    handleStep = handleLogin;
  }

  return (
    <Container>
      <Paragraph>User: {auths ? auths : ''}</Paragraph>
      <Input label="Email" value={email} autoFocus onChangeText={setEmail} />
      {auths && (
        <>
          <Input label="Password" value={password} onChangeText={setPassword} />

          {auths && auths.length === 0 && (
            <DatePicker
              defaultDate={birthday}
              maximumDate={moment().toDate()}
              locale={'en'}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={'fade'}
              androidMode={'default'}
              placeHolderText="Select birthday"
              textStyle={{ fontSize: 18 }}
              placeHolderTextStyle={{ color: '#d3d3d3' }}
              onDateChange={setBirthday}
              disabled={false}
            />
          )}
        </>
      )}
      <Button text="Submit" loading={loading} onPress={handleStep} />
      <Error error={error} />
    </Container>
  );
};

export default LoginScreen;
