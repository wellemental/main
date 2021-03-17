import React from 'react';
import {
  Container,
  FeaturedLoop,
  PageHeading,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { Categories, meditationCategories } from 'common';

const MeditateScreen: React.FC = () => {
  return (
    <>
      <Container fullPage>
        <PageHeading title="Meditate" />

        <FeaturedLoop category={Categories.Meditate} />

        <CategoryLoop categories={meditationCategories} />
      </Container>
      <LockOverlay />
    </>
  );
};

export default MeditateScreen;
