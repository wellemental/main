import React from 'react';
import {
  FeaturedLoop,
  PageHeading,
  LockOverlay,
  CategoryLoop,
} from '../primitives';
import { Categories, meditationCategories } from 'common';

const MeditateScreen: React.FC = () => {
  return (
    <>
      <PageHeading title="Meditate" />

      <FeaturedLoop category={Categories.Meditate} />

      <CategoryLoop categories={meditationCategories} />
      <LockOverlay />
    </>
  );
};

export default MeditateScreen;
