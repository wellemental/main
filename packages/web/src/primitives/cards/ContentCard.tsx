import React from 'react';
import { Content } from 'common';
import AvyName from '../images/AvyName';
import { useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import CardTitle from './CardTitle';
import CardImage from './CardImage';
import CardItem from './CardItem';
import Card from './Card';
import CardBody from './CardBody';
import Box from '../utils/Box';
import { theme } from 'common';

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
        onPress={() => navigation.navigate('Content', { content: content })}>
        <Box row>
          <Box
            width={small ? 1 / 4 : 3 / 10}
            height={small ? 84 : 133}
            maxWidth={small ? 75 : 'inherit'}>
            <CardImage alt={content.title} src={content.thumbnail} />
          </Box>
          <Box width={small ? 3 / 4 : 7 / 10}>
            <CardBody
              style={{
                alignSelf: 'center',
                padding: `${theme.cardPadding}px ${theme.cardPadding}px`,
                paddingBottom: '0px !important',
              }}>
              <CardTitle text={content.title} />
              <Paragraph size={14} style={{ textAlign: 'left' }}>
                {recentDate ? recentDate : content.length}
              </Paragraph>

              {!small && (
                <AvyName
                  source={teacher.photo}
                  name={teacher.name}
                  favoriteId={content.id}
                />
              )}
            </CardBody>
          </Box>
        </Box>
      </CardItem>
    </Card>
  );
};

export default ContentCard;
