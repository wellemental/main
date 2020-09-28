import React, { ReactElement } from 'react';
import { FlatList } from 'react-native';
import TeacherCard from './TeacherCard';
import { useContent, useCurrentUser } from '../hooks';
import ListEmpty from './ListEmpty';
import { Teacher } from 'types';
import { View } from 'react-native';
import { Teachers } from 'services/src';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const TeacherLoop: React.FC<Props> = ({ header, scrollEnabled }) => {
  const { teachers } = useContent();
  const { user } = useCurrentUser();

  let filteredTeachers = Object.values(teachers);

  // Filter by language
  if (user && user.language && filteredTeachers) {
    filteredTeachers = filteredTeachers.filter(
      (item: Teacher) => item.language === user.language,
    );
  }

  const hasFilteredTeachers = filteredTeachers && filteredTeachers.length > 0;

  return teachers && scrollEnabled && hasFilteredTeachers ? (
    <FlatList
      ListHeaderComponent={header}
      numColumns={2}
      style={{ paddingHorizontal: 15 }}
      item
      data={Object.values(filteredTeachers)}
      renderItem={({ item }) => <TeacherCard teacher={item} />}
    />
  ) : teachers && hasFilteredTeachers ? (
    <View
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      {Object.values(teachers).map((item: Teacher, idx) => (
        <TeacherCard key={idx} teacher={item} />
      ))}
    </View>
  ) : (
    <ListEmpty />
  );
};

export default TeacherLoop;
