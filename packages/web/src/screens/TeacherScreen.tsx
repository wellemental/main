import React from 'react';
import { ContentLoop, PageHeading } from '../primitives';
import { useLocation } from '../hooks';

const TeacherScreen: React.FC = () => {
  const { state } = useLocation();
  const { teacher } = state;

  return (
    <>
      <PageHeading
        title={`I'm ${teacher.name}!`}
        subtitle={teacher.bio}
        avatar={teacher.photo}
        center
      />
      <ContentLoop teacher={teacher.name} />
    </>
  );
};

export default TeacherScreen;
