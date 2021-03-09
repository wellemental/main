import React from 'react';
import { Content } from 'common';
import AvyName from './AvyName';
import { useHistory } from '../hooks';
import Paragraph from './Paragraph';
import CardTitle from './CardTitle';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { slugify } from '../services/helpers';

interface Props {
  content: Content;
}

const ContentCard: React.FC<Props> = ({ content }) => {
  const history = useHistory();

  const teacher = content.teacher;

  if (!teacher) {
    console.log('CONTENT', content);
    console.log('TEACHER', teacher);
  }
  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardActionArea
        onClick={() => history.push(`/content/${slugify(content.title)}`)}>
        <Box display="flex" flexDirection="row">
          <CardMedia
            component="img"
            alt={content.title}
            height="125px"
            image={content.thumbnail}
            title={content.title}
            style={{ width: '125px', borderRadius: '20px' }}
          />
          <CardContent
            style={{ width: 'calc(100% - 125px)', padding: '10px 10px 5px' }}>
            <Paragraph size={14}>{content.length}</Paragraph>
            <CardTitle text={content.title} />

            <AvyName
              source={teacher.photo}
              name={teacher.name}
              favoriteId={content.id}
            />
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
