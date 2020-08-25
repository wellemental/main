import React from 'react';
import TeacherCard from './TeacherCard';
import { useContent } from '../hooks';
import ListEmpty from './ListEmpty';
import { Teacher } from 'types';
import { View } from 'react-native';

const TeacherLoop: React.FC = () => {
  const { teachers } = useContent();

  return (
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
  );
};

export default TeacherLoop;
