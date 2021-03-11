import React from 'react';
import {
  Container,
  ContentLoop,
  PageHeading,
  LockOverlay,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

  return (
    <>
      <Container scrollEnabled bg="Evening">
        <PageHeading noHeader title={translation.Sleep} color="white" />
        <ContentLoop filter={Tags.Sleep} />
      </Container>
      {!activePlan && <LockOverlay />}
    </>
  );
};

export default SleepScreen;
