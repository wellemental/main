import React, { useState } from 'react';
import { View } from 'native-base';
import {
  Button,
  Container,
  Error,
  PageHeading,
  Input,
  Paragraph,
} from '../primitives';
import { ForgotPasswordScreenRouteProp } from '../types';
import { ForgotPasswordService } from 'services';

interface Props {
  route: ForgotPasswordScreenRouteProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({ route }) => {
  const { translation } = route.params;
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
      return Promise.reject(err);
    }
    return Promise.resolve();
  };

  return (
    <Container>
      <PageHeading title={translation['Forgot password?']} />
      <Error error={error} />
      {isReset ? (
        <Paragraph>
          {translation['Check your email for a reset password link.']}
        </Paragraph>
      ) : (
        <View>
          <Input
            label={translation.Email}
            keyboard="email-address"
            value={email}
            autoCapitalize="none"
            autoCompleteType="email"
            autoCorrect={false}
            autoFocus
            onChangeText={setEmail}
          />

          <Button
            primary
            loading={loading}
            onPress={handlePressForgotPassword}
            text={translation['Reset Password']}
          />
        </View>
      )}
    </Container>
  );
};

export default ForgotPasswordScreen;
