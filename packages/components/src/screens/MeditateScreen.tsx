import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  FeaturedLoop,
  PageHeading,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, meditationCategories } from 'common';

const MeditateScreen: React.FC = () => {
  const { translation, activePlan, user } = useCurrentUser();

  const { getFeatures } = useContent();

  const data = getFeatures(Categories.Meditate);

  return (
    <>
      <Container scrollEnabled bg="Meditate">
        <PageHeading noHeader title={translation.Meditate} />

        <FeaturedLoop category={Categories.Meditate} />

        <CategoryLoop categories={meditationCategories} />
      </Container>
      {!activePlan && <LockOverlay />}
    </>
  );
};

export default MeditateScreen;
