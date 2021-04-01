import React from 'react';
import { Page, ContentLoop, PageHeading, LockOverlay } from '../primitives';
import { useCurrentUser } from '../hooks';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  return (
    <>
      <Page
        fullPage
        // bg="Evening"
      >
        <PageHeading title="Sleep" color="white" />
        <ContentLoop filter={Tags.Sleep} />
      </Page>
      <LockOverlay />
    </>
  );
};

export default SleepScreen;
