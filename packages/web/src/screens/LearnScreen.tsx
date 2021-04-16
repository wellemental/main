import React from 'react';
import {
  Container,
  FeaturedLoop,
  LockOverlay,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { Categories, learnCategories } from 'common';

const LearnScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  return (
    <>
      <PageHeading title={translation.Learn} />

      <FeaturedLoop category={Categories.Learn} />

      <CategoryLoop
        categories={learnCategories}
        colors={['yellow', 'blurple']}
      />

      <LockOverlay />
    </>
  );
};

export default LearnScreen;
