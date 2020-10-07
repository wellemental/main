import React, { useState, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { H2 } from 'native-base';
import {
  Box,
  Container,
  Button,
  Paragraph,
  Error,
  Input,
  Spinner,
  PageHeading,
} from '../primitives';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService, logger } from 'services';
import styled from 'styled-components';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  setLock: React.Dispatch<boolean>;
};

const AskParentsScreen: React.FC<Props> = ({ setLock }) => {
  const { auth, user, translation } = useCurrentUser();
  const [error, setError] = useState('');

  const [answer, setAnswer] = useState<number>();

  const handleAnswer = () => {
    setError('');
    if (+answer === 42) {
      setLock(false);
    } else {
      setError(translation['Please ask your parents to proceed']);
    }
  };

  return (
    <Container scrollEnabled>
      <PageHeading title={translation['Ask your parents']} />

      <>
        <H2>{translation['What is 6 x 7?']}</H2>
        <Input
          label={translation.Answer}
          value={answer}
          autoFocus
          type="number"
          onChangeText={setAnswer}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          primary
          disabled={!answer}
          text={translation.Submit}
          onPress={handleAnswer}
        />
      </>

      {/* <Box gt={1}>
        <Button
          transparent
          disabled={processing}
          loading={processing}
          text={
            showAccessDisplay
              ? translation['New account?']
              : translation['Access code?']
          }
          onPress={() => toggleDisplay(!showAccessDisplay)}
        />
      </Box> */}

      <Error error={error} center />
    </Container>
  );
};

export default AskParentsScreen;
