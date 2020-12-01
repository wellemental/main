import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch } from '../hooks';
import { capitalize } from '../services/helpers';
import { Teacher } from '../types';

const TeacherScreen: React.FC = () => {
  const { teachers } = useContent();
  const match = useRouteMatch('teacher');

  let teacher: Teacher | null = null;
  if (!teacher) {
    if (teachers) {
      teacher = teachers[capitalize(match)];
    }
  }

  return !teacher ? (
    <Spinner />
  ) : (
    <>
      <PageHeading
        title={`I'm ${teacher.name}!`}
        subtitle={teacher.bio}
        avatar={teacher.photo}
        center
      />
      {teacher && <ContentLoop teacher={teacher.name} />}
    </>
  );
};

export default TeacherScreen;
