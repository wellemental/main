import React from 'react';
import { Container, PageHeading, TeacherLoop } from '../primitives';
import { useCurrentUser } from '../hooks';

const TeachersScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  return (
    <Container scrollEnabled noPadding="horizontal">
      <PageHeading noHeader title={translation.Teachers} />

      <TeacherLoop scrollEnabled />
    </Container>
  );
};

export default TeachersScreen;
