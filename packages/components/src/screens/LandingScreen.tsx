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
      <Image
        source={require('../assets/images/logo.jpeg')}
        style={{
          height: imageHeight,
          width: imageWidth,
          resizeMode: 'contain',
        }}
      />
      <Paragraph style={{ marginTop: -20 }} gb={4} size={20}>
        Let's Practice
      </Paragraph>

      <View style={{ position: 'absolute', bottom: 20, left: 15, right: 15 }}>
        <Box gv={1}>
          <Button
            large
            text="English"
            loading={loading}
            onPress={() =>
              navigation.navigate('Auth', { language: Languages.En })
            }
          />
        </Box>
        <Button
          large
          warning
          // style={{ width: deviceWidth - 30 }}
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
