import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Card, CardItem, Body, Input, Item } from 'native-base';
import { Container, Button, Error, Headline, Box } from '../primitives';
import { useCurrentUser, useNavigation } from '../hooks';

type Props = {
  setLock: React.Dispatch<boolean>;
};

const AskParentsScreen: React.FC<Props> = ({ setLock }) => {
  const { translation } = useCurrentUser();
  const navigation = useNavigation();
  const [error, setError] = useState('');

  const [answer, setAnswer] = useState<number>();

  const handleAnswer = () => {
    setError('');
    if (+answer === 99) {
      setLock(false);
    } else {
      setError(translation['Please ask your parents to proceed']);
    }
  };

  return (
    <Container bg="AskParents">
      <Box mt={Platform.OS === 'android' ? 12 : 6}>
        <Headline center color="white">
          {translation['Ask your parents']}
        </Headline>
      </Box>

      <Card>
        <CardItem>
          <Body style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
            <Headline style={{ alignSelf: 'center' }}>
              {translation['What is 9 x 11?']}
            </Headline>

            <Item inlineLabel style={{ marginVertical: 25 }}>
              <Input
                value={answer}
                autoFocus
                type="number"
                onChangeText={setAnswer}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  fontSize: 32,
                  lineHeight: 32,
                  height: Platform.OS === 'ios' ? 40 : 60,
                  textAlign: 'center',
                  marginBottom: Platform.OS === 'ios' ? 10 : 0,
                }}
              />
            </Item>
            <Button
              primary
              large
              disabled={!answer}
              text={translation.Submit}
              onPress={handleAnswer}
            />
            <Error center error={error} />
          </Body>
        </CardItem>
      </Card>
      <Button
        light
        transparent
        text={`‹ ${translation['Back']}`}
        onPress={() => navigation.goBack()}
      />
    </Container>
  );
};

export default AskParentsScreen;
