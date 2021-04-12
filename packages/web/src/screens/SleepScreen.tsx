import React from 'react';
import { ContentLoop, PageHeading, LockOverlay } from '../primitives';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  return (
    <>
      <PageHeading title="Sleep" color="white" />
      <ContentLoop filter={Tags.Sleep} />

      <LockOverlay />
    </>
  );
};

export default SleepScreen;
