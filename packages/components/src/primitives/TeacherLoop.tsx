import React, { ReactElement } from 'react';
import { FlatList } from 'react-native';
import TeacherCard from './TeacherCard';
import { useContent } from '../hooks';
import ListEmpty from './ListEmpty';
import { Teacher } from 'types';
import { View } from 'react-native';

type Props = {
  scrollEnabled?: boolean;
  header?: ReactElement;
};

const TeacherLoop: React.FC<Props> = ({ header, scrollEnabled }) => {
  const { teachers } = useContent();

  return teachers && scrollEnabled ? (
    <FlatList
      ListHeaderComponent={header}
      numColumns={2}
      item
      data={Object.values(teachers)}
      renderItem={({ item }) => <TeacherCard teacher={item} />}
    />
  ) : teachers ? (
    <View
      style={{
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      {teachers ? (
        Object.values(teachers).map((item: Teacher, idx) => (
          <TeacherCard key={idx} teacher={item} />
        ))
      ) : (
        <ListEmpty />
      )}
    </View>
  ) : (
    <ListEmpty />
  );
};

export default TeacherLoop;
