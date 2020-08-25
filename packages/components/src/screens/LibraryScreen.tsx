import React from 'react';
import {
  Tabs,
  Container,
  ContentLoop,
  PageHeading,
  TeacherLoop,
} from '../primitives';
import { Tags } from 'services';

const LibraryScreen: React.FC = () => {
  const tabs = {
    All: <ContentLoop />,
    Move: <ContentLoop filter={Tags.Move} />,
    Meditate: <ContentLoop filter={Tags.Meditate} />,
    Learn: <ContentLoop filter={Tags.Learn} />,
    Sleep: <ContentLoop filter={Tags.Sleep} />,
    Teachers: <TeacherLoop />,
  };

  return (
    <Container>
      {/* <SearchBar value={searchTerm} setState={setSearchTerm} /> */}
      <PageHeading title="Let's Practice." />
      <Tabs filters={tabs} />
    </Container>
  );
};

export default LibraryScreen;
