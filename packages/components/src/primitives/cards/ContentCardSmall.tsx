import React from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import { Content } from 'common';
import Image from '../images/Image';
import CardTitle from './CardTitle';
import Paragraph from '../typography/Paragraph';
import { useNavigation } from '../../hooks';
import variables from '../../assets/native-base-theme/variables/wellemental';

interface Props {
  content: Content;
  recentDate?: string;
}

const ContentCardSmall: React.FC<Props> = ({ content, recentDate }) => {
  const navigation = useNavigation();

  return (
    <Card style={{ marginBottom: 5 }}>
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
              height: 82,
              flex: 1,
              marginLeft: -1,
              marginBottom: -1,
              borderRadius: variables.cardBorderRadius,
            }}
          />
        </Left>
        <Body
          style={{
            flex: 3.5,
            padding: 15,
            paddingBottom: 5,
          }}>
          <CardTitle>{content.title}</CardTitle>
          <Paragraph color="lightText" size={16}>
            {recentDate ? recentDate : content.length}
          </Paragraph>
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCardSmall;
