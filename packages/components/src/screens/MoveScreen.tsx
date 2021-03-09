import React, { useEffect } from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  PageHeading,
  CategoryCard,
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
      <Subheadline>{translation.Categories}</Subheadline>

      {moveCategories.map((category) => (
        <CategoryCard key={category.title} category={category} />
      ))}
    </Container>
  );
};

export default MoveScreen;
