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
import { Content } from 'types';

interface Props {
  content: Content;
}

const Card: React.FC = ({ content }) => {
  return (
    <NBCard>
      <CardItem cardBody>
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
          5:34
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
            style={{ width: 40, height: 40 }}
            source={{
              uri:
                'https://www.wyzowl.com/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png',
            }}
          />
          <Body>
            <Text>{content.teacher}</Text>
          </Body>
          <Right>
            <Button rounded transparent>
              <Icon name="heart" />
            </Button>
          </Right>
        </Left>
      </CardItem>
    </NBCard>
  );
};

export default Card;
