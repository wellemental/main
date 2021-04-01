import React, { ReactElement } from 'react';
import { FlatList } from 'react-native';
import TeacherCard from '../cards/TeacherCard';
import Box from '../utils/Box';
import Loading from '../loaders/Loading';
import { useCurrentUser, useQuery, useContainer } from '../../hooks';
import ListEmpty from '../typography/ListEmpty';
import { Teacher, TeacherServiceType } from 'common';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const TeacherLoop: React.FC<Props> = ({ header, scrollEnabled }) => {
  const { user } = useCurrentUser();

  const container = useContainer();
  const service = container.getInstance<TeacherServiceType>('teacherService');

  const { data: teachers, loading } = useQuery(service.getAll);

  const renderTeachers = (): Teacher[] => {
    let arr: Teacher[] = [];

    if (teachers) {
      arr = Object.values(teachers);
      arr = arr.filter((item: Teacher) => item.language === user.language);
    }

    return arr;
  };

  return (
    <Loading loading={loading}>
      {scrollEnabled && teachers ? (
        <FlatList
          ListHeaderComponent={header}
          numColumns={2}
          data={renderTeachers()}
          renderItem={({ item }) => <TeacherCard teacher={item} />}
        />
      ) : teachers ? (
        <Box
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          {renderTeachers().map((teacher, idx) => (
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
