import React, { useEffect } from 'react';
import {
  Container,
  ContentLoopSmall,
  Headline,
  Subheadline,
  PageHeading,
  CategoryCard,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { ContentService } from 'services';
import { Categories, Content, Tags, meditationCategories } from 'common';

const MeditateScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();

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

      {meditationCategories.map((category) => (
        <CategoryCard key={category.title} category={category} />
      ))}
    </Container>
  );
};

export default MeditateScreen;
