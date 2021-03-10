import React from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import { View } from 'react-native';
import { Content } from 'common';
import AvyName from './AvyName';
import Headline from './Headline';
import Image from './Image';
import { useNavigation } from '../hooks';
import Paragraph from './Paragraph';

interface Props {
  content: Content;
}

const ContentCard: React.FC<Props> = ({ content }) => {
  const navigation = useNavigation();
  const teacher = content.teacher;

  return (
    <Card>
      <CardItem
        cardBody
        button
        onPress={() =>
          navigation.navigate('Content', {
            content,
          })
        }>
        <Left>
          <Image
            source={{
              uri: content.thumbnail,
            }}
            style={{
              height: 126,
              width: 100,
              flex: 1,
              borderRadius: 20,
              marginLeft: -1,
              marginTop: -1,
              marginBottom: -1,
            }}
          />
        </Left>
        <Body
          style={{
            flex: 2,
            justifyContent: 'space-between',
            padding: 15,
            paddingBottom: 5,
          }}>
          <View style={{ flex: 1 }}>
            <Headline small numberOfLines={1}>
              {content.title}
            </Headline>
            <Paragraph>{content.length}</Paragraph>
          </View>
          {teacher && (
            <AvyName
              source={teacher.photo}
              name={teacher.name}
              favoriteId={content.id}
            />
          )}
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCard;
