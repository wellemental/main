import React from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import { View } from 'react-native';
import { Content } from 'common';
import AvyName from '../images/AvyName';
import CardTitle from './CardTitle';
import Image from '../images/Image';
import { useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import variables from '../../assets/native-base-theme/variables/wellemental';

interface Props {
  content: Content;
  small?: boolean;
  recentDate?: string;
}

const ContentCard: React.FC<Props> = ({ content, small, recentDate }) => {
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
              height: small ? 84 : 125,
              flex: 1,
              borderRadius: variables.cardBorderRadius,
              marginLeft: -1,
              marginTop: -1,
              marginBottom: -1,
            }}
          />
        </Left>
        <Body
          style={{
            flex: small ? 3 : 2,
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingBottom: 5,
            paddingTop: 10,
          }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <CardTitle>{content.title}</CardTitle>
            <Paragraph color="lightText" size={16}>
              {recentDate ? recentDate : content.length}
            </Paragraph>
          </View>
          {!small && teacher && (
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
