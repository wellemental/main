import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  PageHeading,
  CategoryCard,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, learnCategories } from 'common';

const LearnScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  const { getFeatures } = useContent();

  const data = getFeatures(Categories.Learn);

  return (
    <Container scrollEnabled bg="Learn">
      <PageHeading color="white" noHeader title={translation.Learn} />

      <Subheadline color="white">{translation.Featured}</Subheadline>
      <ContentLoopSmall content={data} />
      <Subheadline color="white">{translation.Categories}</Subheadline>

      {learnCategories.map((category) => (
        <CategoryCard key={category.title} category={category} />
      ))}
    </Container>
  );
};

export default LearnScreen;
