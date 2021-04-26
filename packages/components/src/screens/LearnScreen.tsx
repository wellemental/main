import React from 'react';
import {
  Container,
  FeaturedLoop,
  LockOverlay,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { Categories, learnCategories } from 'common';

const LearnScreen: React.FC = () => {
  return (
    <>
      <Container scrollEnabled bg="Learn">
        <PageHeading noHeader title="Learn" />

        <FeaturedLoop category={Categories.Learn} />

        <CategoryLoop
          categories={learnCategories}
          colors={['yellow', 'blurple']}
        />
      </Container>
      <LockOverlay />
    </>
  );
};

export default LearnScreen;
