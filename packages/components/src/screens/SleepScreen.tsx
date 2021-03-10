import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  return (
    <Container scrollEnabled bg="Evening">
      <PageHeading noHeader title={translation.Sleep} color="white" />
      <ContentLoop filter={Tags.Sleep} />
    </Container>
  );
};

export default SleepScreen;
