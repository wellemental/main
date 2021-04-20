import React, { useState } from 'react';
import { Languages } from 'common';
import { Container, Button, Error, Box } from '../primitives';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deviceWidth } from 'services';

const imageWidth = deviceWidth * 0.8;
const imageHeight = imageWidth * 0.4;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Container center>
      <Box mb={4}>
        <Image
          source={require('../assets/images/icon.png')}
          style={{
            height: imageHeight,
            width: imageWidth,
            resizeMode: 'contain',
          }}
        />
      </Box>

      <View style={{ position: 'absolute', bottom: 20, left: 15, right: 15 }}>
        <Box my={1}>
          <Button
            text="English"
            onPress={() =>
              // Pass language in with the navigation
              navigation.navigate('Auth', { language: Languages.En })
            }
          />
        </Box>
        <Button
          warning
          text="Español"
          onPress={() =>
            // Pass language in with the navigation
            navigation.navigate('Auth', { language: Languages.Es })
          }
        />
      </View>
    </Container>
  );
};

export default LandingScreen;
