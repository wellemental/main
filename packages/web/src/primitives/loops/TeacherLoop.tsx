import React, { ReactElement, useEffect, useState } from 'react';
import TeacherCard from '../cards/TeacherCard';
import Loading from '../loaders/Loading';
import Box from '../utils/Box';
import { useCurrentUser, useQuery } from '../../hooks';
import ListEmpty from '../typography/ListEmpty';
import { Teacher, AllTeachers } from 'common';
import { TeacherService } from '../../services';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const service = new TeacherService();

const TeacherLoop: React.FC<Props> = () => {
  const { user } = useCurrentUser();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const { data, loading } = useQuery<AllTeachers>(service.getAll);

  // This should def be handled somewhere else, improve later
  const renderTeachers = (): void => {
    let arr: Teacher[] = data ? Object.values(data) : [];

    if (data) {
      arr = arr.filter((item: Teacher) => item.language === user.language);
    }

    setTeachers(arr);
  };

  useEffect(() => {
    if (data) {
      renderTeachers();
    }
  }, [data]);

  return (
    <Loading loading={loading}>
      {teachers ? (
        <Box
          row
          style={{
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {teachers.map((teacher, idx) => (
            <TeacherCard key={idx} teacher={teacher} />
          ))}
        </Box>
      ) : (
        <ListEmpty />
      )}
    </Loading>
  );
};

export default TeacherLoop;
