import React from 'react';
import { Page, ContentLoop, PageHeading, LockOverlay } from '../primitives';
import { useCurrentUser } from '../hooks';
import { Tags } from 'common';

const SleepScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  return (
    <>
      <Page
      // bg="Evening"
      >
        {/* <ContentLoop
          // header={
          //   <PageHeading noHeader title={translation.Sleep} color="white" />
          // }
          filter={Tags.Sleep}
        /> */}
      </Page>
      <LockOverlay />
    </>
  );
};

export default SleepScreen;
