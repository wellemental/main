import React, { ReactElement } from 'react';
import TeacherCard from './TeacherCard';
import { Box } from '../primitives';
import { useContent, useCurrentUser } from '../hooks';
import ListEmpty from './ListEmpty';
import { Teacher } from '../types';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const TeacherLoop: React.FC<Props> = ({ header, scrollEnabled }) => {
  const { teachers } = useContent();
  const { user } = useCurrentUser();

  let filteredTeachers;

  if (teachers) {
    filteredTeachers = Object.values(teachers);
  }

  // Filter by language
  if (user && user.language && filteredTeachers) {
    filteredTeachers = filteredTeachers.filter(
      (item: Teacher) => item.language === user.language,
    );
  }

  const hasFilteredTeachers = filteredTeachers && filteredTeachers.length > 0;

  return teachers && hasFilteredTeachers ? (
    <Box
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      {Object.values(teachers).map((item: Teacher, idx) => (
        <TeacherCard key={idx} teacher={item} />
      ))}
    </Box>
  ) : (
    <ListEmpty />
  );
};

export default TeacherLoop;
