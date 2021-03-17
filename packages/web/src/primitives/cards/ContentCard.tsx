import React from 'react';
import { Content } from 'common';
import AvyName from '../images/AvyName';
import { useHistory } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import CardTitle from './CardTitle';
import CardImage from './CardImage';
import CardItem from './CardItem';
import Card from './Card';
import CardBody from './CardBody';
import Box from '../utils/Box';
import { slugify } from 'common';

interface Props {
  content: Content;
}

const ContentCard: React.FC<Props> = ({ content }) => {
  const history = useHistory();

  const teacher = content.teacher;

  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardItem
        onPress={() => history.push(`/content/${slugify(content.title)}`)}>
        <Box display="flex" flexDirection="row">
          <CardImage alt={content.title} src={content.thumbnail} width={125} />
          <CardBody
            style={{ width: 'calc(100% - 125px)', padding: '10px 10px 5px' }}>
            <Paragraph size={14}>{content.length}</Paragraph>
            <CardTitle text={content.title} />

            <AvyName
              source={teacher.photo}
              name={teacher.name}
              favoriteId={content.id}
            />
          </CardBody>
        </Box>
      </CardItem>
    </Card>
  );
};

export default ContentCard;
