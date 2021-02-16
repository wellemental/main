import React from 'react';
import { Card, CardItem, Left, Body } from 'native-base';
import { View } from 'react-native';
import { Content } from 'services';
import Image from './Image';
import Headline from './Headline';
import { useNavigation } from '../hooks';
import { Teacher } from 'services';
import Paragraph from './Paragraph';

interface Props {
  content: Content;
  teacher: Teacher;
  recentDate?: string;
}

const ContentCardSmall: React.FC<Props> = ({
  content,
  teacher,
  recentDate,
}) => {
  const navigation = useNavigation();

  return (
    <Card>
      <CardItem
        cardBody
        button
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
            style={{ height: 82, flex: 1, borderRadius: 20 }}
          />
        </Left>
        <Body
          style={{
            flex: 3.5,
            padding: 15,
            paddingBottom: 5,
          }}>
          <Paragraph fine>{recentDate ? recentDate : content.length}</Paragraph>
          <Headline
            small
            numberOfLines={1}
            style={{ marginTop: 5, marginBottom: 7 }}>
            {content.title}
          </Headline>
        </Body>
      </CardItem>
    </Card>
  );
};

export default ContentCardSmall;
