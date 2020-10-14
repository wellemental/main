import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ImageBackground, View } from 'react-native';
import { H2, H1, Card, CardItem, Body, Input, Item } from 'native-base';
import {
  Box,
  Container,
  Button,
  Paragraph,
  Error,
  Spinner,
  PageHeading,
} from '../primitives';
import { useCurrentUser, useIap } from '../hooks';
import RNIap, { requestSubscription } from 'react-native-iap';
import { Platform } from 'react-native';
import { PromoCodeService, logger } from 'services';
import styled from 'styled-components';
import variables from '../assets/native-base-theme/variables/wellemental';
import { deviceHeight, deviceWidth } from 'services';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

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
                  {translation['What is 6 x 7?']}
                </H1>

                <Item inlineLabel style={{ marginVertical: 25 }}>
                  <Input
                    // label={translation.Answer}
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
              </Body>
            </CardItem>
          </Card>

          <Error error={error} center />
        </Container>
      </ImageBackground>
    </View>
  );
};

export default AskParentsScreen;
