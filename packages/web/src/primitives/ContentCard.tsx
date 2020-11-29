import React from 'react';
import { Card, CardContent as CardItem, Box } from '@material-ui/core';
import { Content, Teacher } from '../types';
import AvyName from './AvyName';
import Image from './Image';
import { useHistory } from '../hooks';
import Paragraph from './Paragraph';
import Headline from './Headline';

interface Props {
  content: Content;
  teacher: Teacher;
}

const ContentCard: React.FC<Props> = ({ content, teacher }) => {
  const history = useHistory();

  return (
    <Box display="flex" flexDirection="row">
      {/* // onClick={history.push('/content', { content, teacher })}> */}
      <img
        src={content.thumbnail}
        style={{
          height: '125px',
          width: '125px',
          borderRadius: 20,
          padding: '10px',
        }}
      />

      {/* <React.Fragment
          style={{
            flex: 2,
            justifyContent: 'space-between',
            padding: 15,
            paddingBottom: 5,
          }}> */}
      <Box>
        <React.Fragment>
          <Paragraph size={14}>{content.length}</Paragraph>
          <Paragraph variant="subtitle2" noWrap>
            {content.title}
          </Paragraph>
        </React.Fragment>
        <AvyName
          source={teacher.photo}
          name={content.teacher}
          favoriteId={content.id}
        />
      </Box>
    </Box>
  );
};

export default ContentCard;
