import React from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import { Content } from 'common';
import Image from './Image';
import Headline from './Headline';
import Paragraph from './Paragraph';
import { useNavigation } from '../hooks';

interface Props {
  content: Content;
  recentDate?: string;
}

const ContentCardSmall: React.FC<Props> = ({ content, recentDate }) => {
  const navigation = useNavigation();

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
            style={{ height: 82, flex: 1, borderRadius: 20 }}
          />
        </Left>
        <Body
          style={{
            flex: 3.5,
            padding: 15,
            paddingBottom: 5,
          }}>
          <Headline
            small
            numberOfLines={1}
            style={{ marginTop: 5, marginBottom: 7 }}>
            {content.title}
          </Headline>
          <Paragraph fine>{recentDate ? recentDate : content.length}</Paragraph>
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCardSmall;
