import React from 'react';
import { Container, PageHeading, TeacherLoop } from '../primitives';

const TeachersScreen: React.FC = () => {
  return (
    <Container>
      <PageHeading title="Teachers" />

      <TeacherLoop scrollEnabled />
    </Container>
  );
};

export default TeachersScreen;
