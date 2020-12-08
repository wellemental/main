import React, { useState } from 'react';
import { ImageBackground, View } from 'react-native';
import { H1, Card, CardItem, Body, Input, Item } from 'native-base';
import { Container, Button, Error } from '../primitives';
import { useCurrentUser } from '../hooks';
import { deviceHeight, deviceWidth } from 'services';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';
import { tracker, TrackingEvents } from 'services';

type Props = {
  setLock: React.Dispatch<boolean>;
};

const AskParentsScreen: React.FC<Props> = ({ setLock }) => {
  const { translation } = useCurrentUser();
  const [error, setError] = useState('');

  const [answer, setAnswer] = useState<number>();

  const handleAnswer = () => {
    setError('');
    if (+answer === 99) {
      tracker.track(TrackingEvents.AskParentsSucceed);
      setLock(false);
    } else {
      tracker.track(TrackingEvents.AskParentsFail);
      setError(translation['Please ask your parents to proceed']);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: brandColors.skyBlue,
      }}>
      <ImageBackground
        source={require('../assets/images/parents_bg.png')}
        style={{
          width: deviceWidth,
          height: deviceHeight,
          flex: 1,
        }}>
        <Container scrollEnabled color="rgba(0,0,0,0)">
          <H1
            style={{
              color: 'white',
              alignSelf: 'center',
              paddingBottom: 20,
              paddingTop: 40,
            }}>
            {translation['Ask your parents']}
          </H1>

          <Card>
            <CardItem>
              <Body style={{ paddingVertical: 20, paddingHorizontal: 10 }}>
                <H1 style={{ alignSelf: 'center' }}>
                  {translation['What is 9 x 11?']}
                </H1>

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
                      height: 40,
                      textAlign: 'center',
                      marginBottom: 10,
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
        </Container>
      </ImageBackground>
    </View>
  );
};

export default AskParentsScreen;
