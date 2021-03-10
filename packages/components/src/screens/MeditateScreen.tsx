import React from 'react';
import {
  Container,
  ContentLoopSmall,
  Subheadline,
  PageHeading,
  CategoryLoop,
} from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories, meditationCategories } from 'common';

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

      <CategoryLoop categories={meditationCategories} />
    </Container>
  );
};

export default MeditateScreen;
