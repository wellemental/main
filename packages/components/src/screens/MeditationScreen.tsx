import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';

const MeditationScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const favorites =
    user &&
    user.favorites &&
    Object.keys(user.favorites).filter(
      (item: string) => user.favorites[item].favorited,
    );

  return (
    <Container scrollEnabled>
      <PageHeading noHeader title={translation['Your Favorites']} />
      {/* <Tabs tabs={tabs} active={tab} setTab={setTab} /> */}
      <ContentLoop favorites={favorites} />
    </Container>
  );
};

export default MeditationScreen;
