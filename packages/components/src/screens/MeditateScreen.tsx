import React from 'react';
import { Container, ContentLoop, Headline, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';

const MeditateScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();

  return (
    <Container scrollEnabled bg="Meditate">
      <PageHeading noHeader title={translation.Meditate} />
      {/* <Tabs tabs={tabs} active={tab} setTab={setTab} /> */}
      {/* <ContentLoop favorites={favorites} /> */}

      <Headline small>{translation.Featured}</Headline>
      <Headline small>{translation.Categories}</Headline>
    </Container>
  );
};

export default MeditateScreen;
