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
      <Container scrollEnabled bg="Learn">
        <PageHeading noHeader title={translation.Learn} />

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
