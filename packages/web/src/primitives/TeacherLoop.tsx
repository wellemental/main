import React, { ReactElement } from 'react';
import TeacherCard from './TeacherCard';
import { Box, Loading } from '../primitives';
import { useContent, useCurrentUser, useQuery } from '../hooks';
import ListEmpty from './ListEmpty';
import { Teacher, AllTeachers } from 'common';
import { TeacherService } from '../services';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const service = new TeacherService();

const TeacherLoop: React.FC<Props> = ({ header, scrollEnabled }) => {
  const { user } = useCurrentUser();
  const { data: teachers, loading } = useQuery<AllTeachers>(service.getAll);

  const renderTeachers = (): React.ReactElement[] => {
    let arr: Teacher[] = [];

    if (teachers) {
      arr = Object.values(teachers);
      arr = arr.filter((item: Teacher) => item.language === user.language);
    }
    return arr.map((teacher, idx) => (
      <TeacherCard key={idx} teacher={teacher} />
    ));
  };

  // Filter by language
  // if (user && user.language) {
  //   filteredTeachers = filteredTeachers.filter(
  //     (item: Teacher) => item.language === user.language,
  //   );
  // }

  // const hasFilteredTeachers = filteredTeachers && filteredTeachers.length > 0;

  return (
    <Loading loading={loading}>
      {!teachers ? (
        <Box
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {renderTeachers()}
        </Box>
      ) : (
        <ListEmpty />
      )}
    </Loading>
  );
};

export default TeacherLoop;
