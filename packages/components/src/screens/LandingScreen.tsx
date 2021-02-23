import React, { useState } from 'react';
import { Languages } from 'services';
import { Container, Button, Error, Box, Paragraph } from '../primitives';
import { Image, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { deviceWidth } from 'services';

const imageWidth = deviceWidth * 0.8;
const imageHeight = imageWidth * 0.4;

const LandingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [auths, setAuths] = useState<null | string[]>();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

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
            loading={loading}
            onPress={() =>
              navigation.navigate('Auth', { language: Languages.En })
            }
          />
        </Box>
        <Button
          warning
          text="Español"
          loading={loading}
          onPress={() =>
            navigation.navigate('Auth', { language: Languages.Es })
          }
        />
        <Error error={error} />
      </View>
    </Container>
  );
};

export default LandingScreen;
