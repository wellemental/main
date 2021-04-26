import React from 'react';
import {
  FeaturedLoop,
  LockOverlay,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { Categories, learnCategories } from 'common';

const LearnScreen: React.FC = () => {
  return (
    <>
      <PageHeading title="Learn" />

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
