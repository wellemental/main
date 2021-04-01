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
  const { translation } = useCurrentUser();

  return (
    <>
      <Container scrollEnabled bg="Meditate">
        <PageHeading noHeader title={translation.Meditate} />

        <FeaturedLoop category={Categories.Meditate} />

        <CategoryLoop categories={meditationCategories} />
      </Container>
      <LockOverlay />
    </>
  );
};

export default MeditateScreen;
