import React from 'react';
import { Container, PageHeading, TeacherLoop } from '../primitives';

const TeachersScreen: React.FC = () => {
  return (
    <Container noPadding="vertical">
      <TeacherLoop scrollEnabled header={<PageHeading title="Teachers" />} />
    </Container>
  );
};

export default TeachersScreen;
