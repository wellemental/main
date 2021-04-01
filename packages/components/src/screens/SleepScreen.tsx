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
  const { translation } = useCurrentUser();

  return (
    <>
      <Container scrollEnabled={false} bg="Evening">
        <ContentLoop
          header={
            <PageHeading noHeader title={translation.Sleep} color="white" />
          }
          filter={Tags.Sleep}
        />
      </Container>
      <LockOverlay />
    </>
  );
};

export default SleepScreen;
