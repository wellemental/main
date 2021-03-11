import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  LockOverlay,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, learnCategories } from 'common';

const LearnScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

  const { getFeatures } = useContent();

  const data = getFeatures(Categories.Learn);

  return (
    <>
      <Container scrollEnabled bg="Learn">
        <PageHeading noHeader title={translation.Learn} />

        <Subheadline>{translation.Featured}</Subheadline>
        <ContentLoopSmall content={data} />

        <CategoryLoop categories={learnCategories} />
      </Container>
      {!activePlan && <LockOverlay />}
    </>
  );
};

export default LearnScreen;
