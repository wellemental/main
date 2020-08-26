import React from 'react';
import {
  Tabs,
  Container,
  ContentLoop,
  PageHeading,
  TeacherLoop,
} from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';

const LibraryScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  const tabs = {
    [translation.All]: <ContentLoop />,
    [translation.Move]: <ContentLoop filter={Tags.Move} />,
    [translation.Meditate]: <ContentLoop filter={Tags.Meditate} />,
    [translation.Learn]: <ContentLoop filter={Tags.Learn} />,
    [translation.Sleep]: <ContentLoop filter={Tags.Sleep} />,
    [translation.Teachers]: <TeacherLoop />,
  };

  return (
    <Container>
      <PageHeading title={translation["Let's Practice."]} />
      <Tabs filters={tabs} />
    </Container>
  );
};

export default LibraryScreen;
