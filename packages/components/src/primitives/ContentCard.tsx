import React from 'react';
import {
  Card as NBCard,
  CardItem,
  Thumbnail,
  Left,
  Body,
  H3,
} from 'native-base';
import { View, Image } from 'react-native';
import { Content } from 'services';
import Favorite from './Favorite';
import { useNavigation } from '@react-navigation/native';
import { Teacher } from 'services';
import { useCurrentUser } from '../hooks/useCurrentUser';
import Paragraph from './Paragraph';

interface Props {
  content: Content;
  teacher: Teacher;
}

const ContentCard: React.FC<Props> = ({ content, teacher }) => {
  const navigation = useNavigation();
  const { user } = useCurrentUser();

  return (
    <NBCard>
      <CardItem
        cardBody
        button
        style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
        onPress={() =>
          navigation.navigate('Content', {
            content,
            teacher,
          })
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
            <H3>{content.title}</H3>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View
              style={{
                flex: 5,
                flexDirection: 'row',
                alignContent: 'space-between',
              }}>
              <Thumbnail
                small
                source={{
                  uri: teacher.photo,
                }}
              />
              <Paragraph style={{ lineHeight: 42, marginLeft: 10 }}>
                {content.teacher}
              </Paragraph>
            </View>

            <Favorite contentId={content.id} />
          </View>
        </Body>
      </CardItem>
    </NBCard>
  );
};

export default ContentCard;
