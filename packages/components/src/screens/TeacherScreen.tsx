import React from 'react';
import { useCurrentUser } from '../hooks';
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
  const { activePlan } = useCurrentUser();

  return (
    <Container>
      <ContentLoop
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
      {!activePlan && <LockOverlay />}
    </Container>
  );
};

export default TeacherScreen;
