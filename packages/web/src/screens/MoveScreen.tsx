import React from 'react';
import {
  LockOverlay,
  FeaturedLoop,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { Categories, moveCategories } from 'common';

const MoveScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  return (
    <>
      <PageHeading title={translation.Move} />

      <FeaturedLoop category={Categories.Move} />

      <CategoryLoop categories={moveCategories} colors={['orange', 'teal']} />

      <LockOverlay />
    </>
  );
};

export default MoveScreen;
