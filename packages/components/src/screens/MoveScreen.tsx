import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, moveCategories } from 'common';

const MoveScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  const { getFeatures } = useContent();

  const data = getFeatures(Categories.Move);

  return (
    <Container scrollEnabled bg="Move">
      <PageHeading noHeader title={translation.Move} />

      <Subheadline>{translation.Featured}</Subheadline>
      <ContentLoopSmall content={data} />

      <CategoryLoop categories={moveCategories} />
    </Container>
  );
};

export default MoveScreen;
