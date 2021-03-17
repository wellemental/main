import React from 'react';
import { Card, CardItem, CardBody } from './';
import { Content } from 'common';
import CardImage from './CardImage';
import CardTitle from './CardTitle';
import Paragraph from '../typography/Paragraph';
import { useNavigation } from '../../hooks';
import Box from '../utils/Box';
import { slugify } from 'common';

interface Props {
  content: Content;
  recentDate?: string;
}

const ContentCardSmall: React.FC<Props> = ({ content, recentDate }) => {
  const navigation = useNavigation();

  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardItem
        onPress={() =>
          navigation.navigate(`/content/${slugify(content.title)}`)
        }>
        <Box display="flex" flexDirection="row">
          <CardImage
            src={content.thumbnail}
            width={82}
            style={{
              flex: 1,
              marginLeft: -1,
              marginBottom: -1,
              //   borderRadius: variables.cardBorderRadius,
            }}
          />

          <CardBody>
            <CardTitle text={content.title} />
            <Paragraph>{recentDate ? recentDate : content.length}</Paragraph>
          </CardBody>
        </Box>
      </CardItem>
    </Card>
  );
};

export default ContentCardSmall;
