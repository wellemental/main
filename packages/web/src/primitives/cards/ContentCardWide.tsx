import React from 'react';
import AvyName from '../images/AvyName';
import { useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Content, slugify } from 'common';

interface Props {
  content: Content;
}

const ContentCardWide: React.FC<Props> = ({ content }) => {
  const navigation = useNavigation();
  const teacher = content.teacher;

  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardActionArea
        onClick={() => navigation.navigate('Content', { content: content })}>
        <Box>
          <CardMedia
            component="img"
            alt={content.title}
            height="230px"
            image={content.thumbnail}
            title={content.title}
            style={{ borderRadius: '20px' }}
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
              name={teacher.name}
              favoriteId={content.id}
            />
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default ContentCardWide;
