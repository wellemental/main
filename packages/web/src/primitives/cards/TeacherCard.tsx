import React from 'react';
import Paragraph from '../typography/Paragraph';
import { Teacher } from 'common';
import { useHistory } from '../../hooks';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { slugify } from 'common';
interface Props {
  teacher: Teacher;
}

const TeacherCard: React.FC<Props> = ({ teacher }) => {
  const history = useHistory();

  return (
    <Card
      elevation={0}
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
        width: '50%',
        display: 'inline-block',
      }}>
      <CardActionArea
        onClick={() => history.push(`/teacher/${slugify(teacher.name)}`)}>
        <Box>
          <CardMedia
            component="img"
            alt={teacher.name}
            image={teacher.photo}
            title={teacher.name}
            style={{ padding: '0 10px' }}
          />
          <CardContent style={{ flex: 1, padding: '10px 10px 5px' }}>
            <Paragraph variant="subtitle2" noWrap center>
              {teacher.name}
            </Paragraph>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default TeacherCard;
