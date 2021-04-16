import React from 'react';
import {
  Container,
  ContentLoop,
  PageHeading,
  LockOverlay,
} from '../primitives';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  return (
    <>
      <Container scrollEnabled={false} noPadding="vertical" bg="Evening">
        <ContentLoop
          scrollEnabled
          header={<PageHeading noHeader title="Sleep" color="white" />}
          filter={Tags.Sleep}
        />
      </Container>
      <LockOverlay />
    </>
  );
};

export default SleepScreen;
