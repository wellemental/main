import React from 'react';
import {
  Container,
  LockOverlay,
  FeaturedLoop,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser } from '../hooks';
import { Categories, moveCategories } from 'common';

const MoveScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

  return (
    <>
      <Container scrollEnabled bg="Move">
        <PageHeading noHeader title={translation.Move} />

        <FeaturedLoop category={Categories.Move} />

        <CategoryLoop categories={moveCategories} />
      </Container>
      {!activePlan && <LockOverlay />}
    </>
  );
};

export default MoveScreen;
