import React from 'react';
import { Content, Teacher } from '../types';
import AvyName from './AvyName';
import { useHistory } from '../hooks';
import Paragraph from './Paragraph';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { slugify } from '../services/helpers';

interface Props {
  content: Content;
  teacher: Teacher;
}

const ContentCard: React.FC<Props> = ({ content, teacher }) => {
  const history = useHistory();

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
          <CardContent style={{ flex: 1, padding: '10px 10px 5px' }}>
            <>
              <Paragraph size={14}>{content.length}</Paragraph>
              <Paragraph variant="subtitle2" noWrap>
                {content.title}
              </Paragraph>
            </>
            <AvyName
              source={teacher.photo}
              name={content.teacher}
              favoriteId={content.id}
            />
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ContentCard;
