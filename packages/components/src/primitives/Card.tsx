import React from 'react';
import {
  Card as NBCard,
  CardItem,
  Thumbnail,
  Text,
  Button,
  Icon,
  Left,
  Body,
  H3,
  Right,
} from 'native-base';
import { Image } from 'react-native';
import { Content } from 'services';
import { useNavigation } from '@react-navigation/native';
import { Teacher } from 'services';
import { useCurrentUser } from '../hooks';

interface Props {
  content: Content;
  teacher: Teacher;
}

const Card: React.FC<Props> = ({ content, teacher }) => {
  const navigation = useNavigation();
  const { user } = useCurrentUser();

  console.log('USERSSSS', user);

  return (
    <NBCard>
      <CardItem
        cardBody
        button
        onPress={() =>
          navigation.navigate('Content', {
            content,
            teacher,
          })
        }>
        <Image
          source={{
            uri: content.thumbnail,
          }}
          style={{ height: 200, width: null, flex: 1 }}
        />

        <Text
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            backgroundColor: 'white',
            padding: 5,
          }}>
          {content.length}
        </Text>
      </CardItem>
      <CardItem>
        <Body>
          <H3>{content.title}</H3>
        </Body>
      </CardItem>
      <CardItem>
        <Left>
          <Thumbnail
            small
            source={{
              uri: teacher.photo,
            }}
          />
          <Body>
            <Text>{content.teacher}</Text>
          </Body>
          <Right>
            <Button rounded transparent>
              <Icon
                // name={
                //   user.actions[content.id].favorited ? 'heart' : 'heart-outline'
                // }
                name="heart"
              />
            </Button>
          </Right>
        </Left>
      </CardItem>
    </NBCard>
  );
};

export default Card;
