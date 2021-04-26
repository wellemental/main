import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useRouteMatch, useQuery, useContainer } from '../hooks';
import {
  Teacher,
  AllTeachers,
  Teachers,
  TeacherServiceType,
  capitalize,
} from 'common';

const TeacherScreen: React.FC = () => {
  const match: Teachers = useRouteMatch() as Teachers;
  const container = useContainer();
  const service = container.getInstance<TeacherServiceType>('teacherService');
  const { data: teachers, loading } = useQuery<AllTeachers>(service.getAll);

  let teacher: Teacher | null = null;
  if (teachers) {
    teacher = teachers[capitalize(match)];
  }

  return !teacher ? (
    <Spinner fullPage />
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
