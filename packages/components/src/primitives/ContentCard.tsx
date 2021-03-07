import React from 'react';
import { Card, CardItem, Left, Body, H3 } from 'native-base';
import { View } from 'react-native';
import { Content, Teacher } from 'common';
import AvyName from './AvyName';
import Image from './Image';
import { useNavigation } from '../hooks';
import Paragraph from './Paragraph';
import { TeacherScreen } from '../screens';

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
            style={{ height: 125, width: 100, flex: 1, borderRadius: 20 }}
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
            <Paragraph>{content.length}</Paragraph>
            <H3 numberOfLines={1}>{content.title}</H3>
          </View>
          <AvyName
            source={teacher.photo}
            name={teacher.name}
            favoriteId={content.id}
          />
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCard;
