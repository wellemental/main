import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  PageHeading,
  CategoryCard,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, meditationCategories } from 'common';

const colors = ['yellow', 'blurple', 'orange', 'teal'];

const MeditateScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  const { getFeatures } = useContent();

  const data = getFeatures(Categories.Meditate);

  return (
    <Container scrollEnabled bg="Meditate">
      <PageHeading noHeader title={translation.Meditate} />
      {/* <Tabs tabs={tabs} active={tab} setTab={setTab} /> */}
      {/* <ContentLoop favorites={favorites} /> */}

      <Subheadline>{translation.Featured}</Subheadline>
      <ContentLoopSmall content={data} />
      <Subheadline>{translation.Categories}</Subheadline>

      {meditationCategories.map((category, idx) => (
        <CategoryCard
          key={category.title}
          color={colors[idx]}
          category={category}
        />
      ))}
    </Container>
  );
};

export default MeditateScreen;
