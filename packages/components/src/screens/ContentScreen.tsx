import React from 'react';
import { Text } from 'react-native';
import { Container, Button } from '../primitives';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from 'types';
import { StackNavigationProp } from '@react-navigation/stack';

type ContentScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'Content'
>;

const ContentScreen: React.FC = () => {
  const navigation = useNavigation<ContentScreenNavigationProp>();

  return (
    <Container>
      <Text>Oh Teah</Text>
      <Button text="Go Home" onPress={() => navigation.navigate('Home')} />
    </Container>
  );
};

export default ContentScreen;
