import React from 'react';
import {
  Container,
  ContentLoop,
  PageHeading,
  LockOverlay,
} from '../primitives';
import { TeacherScreenRouteProp } from '../types';

type Props = {
  route: TeacherScreenRouteProp;
};

const TeacherScreen: React.FC<Props> = ({ route }) => {
  const { teacher } = route.params;

  return (
    <Container noPadding="vertical">
      <ContentLoop
        scrollEnabled
        teacher={teacher.name}
        header={
          <PageHeading
            title={`I'm ${teacher.name}!`}
            subtitle={teacher.bio}
            avatar={teacher.photo}
            center
          />
        }
      />
      <LockOverlay pb={6} />
    </Container>
  );
};

export default TeacherScreen;
