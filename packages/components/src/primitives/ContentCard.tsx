import React from 'react';
import { Card, CardItem, Thumbnail, Left, Body, H3 } from 'native-base';
import { View, Image } from 'react-native';
import { Content } from 'services';
import Favorite from './Favorite';
import AvyName from './AvyName';
import { useNavigation } from '@react-navigation/native';
import { Teacher } from 'services';
import Paragraph from './Paragraph';

interface Props {
  content: Content;
  teacher: Teacher;
}

const ContentCard: React.FC<Props> = ({ content, teacher }) => {
  const navigation = useNavigation();

  return (
    <Card>
      <CardItem
        cardBody
        button
        // style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
        onPress={() =>
          navigation.navigate(
            content.video_orientation === 'portrait' ? 'Video' : 'Content',
            {
              content,
              teacher,
            },
          )
        }>
        <Left>
          <Image
            source={{
              uri: content.thumbnail,
            }}
            style={{ height: 120, width: null, flex: 1, borderRadius: 20 }}
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
            name={content.teacher}
            favoriteId={content.id}
          />
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCard;