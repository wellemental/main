import React, { ReactElement, useEffect, useState } from 'react';
import TeacherCard from '../cards/TeacherCard';
import Loading from '../loaders/Loading';
import Box from '../utils/Box';
import { useCurrentUser, useQuery, useContainer } from '../../hooks';
import ListEmpty from '../typography/ListEmpty';
import { Teacher, AllTeachers, TeacherServiceType } from 'common';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const TeacherLoop: React.FC<Props> = () => {
  const { language } = useCurrentUser();
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const container = useContainer();
  const service = container.getInstance<TeacherServiceType>('teacherService');
  const { data, loading } = useQuery<AllTeachers>(service.getAll);

  // Filter teachers by language
  useEffect(() => {
    if (data) {
      setTeachers(
        Object.values(data).filter(
          (item: Teacher) => item.language === language,
        ),
      );
    }
  }, [data, language]);

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
