import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { TeacherScreenRouteProp } from '../types';

type Props = {
  route: TeacherScreenRouteProp;
};

const TeacherScreen: React.FC<Props> = ({ route }) => {
  const { teacher } = route.params;

  return (
    <Container scrollEnabled>
      {/* <SearchBar value={searchTerm} setState={setSearchTerm} /> */}
      <PageHeading
        title={`I'm ${teacher.name}!`}
        subtitle={teacher.bio}
        avatar={teacher.photo}
        center
      />
      <ContentLoop teacher={teacher.name} />
    </Container>
  );
};

export default TeacherScreen;
