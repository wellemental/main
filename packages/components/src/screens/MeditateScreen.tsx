import React from 'react';
import {
  Container,
  FeaturedLoop,
  PageHeading,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { Categories, meditationCategories } from 'common';

const MeditateScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

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
