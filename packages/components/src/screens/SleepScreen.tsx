import React from 'react';
import { Container, ContentLoop, Headline, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();

  return (
    <Container scrollEnabled bg="Sleep">
      <PageHeading noHeader title={translation.Sleep} />
      <ContentLoop filter="sleep" />
    </Container>
  );
};

export default SleepScreen;
