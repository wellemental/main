import React from 'react';
import { Container, ContentLoop, PageHeading, Tabs } from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';
import { TabsType } from '../types';

const FavoritesScreen: React.FC = () => {
  const { user } = useCurrentUser();
  const favorites =
    user &&
    user.actions &&
    Object.keys(user.actions).filter(
      (item: string) => user.actions[item].favorited,
    );

  const tabs: TabsType = {
    All: <ContentLoop favorites={favorites} />,
    Move: <ContentLoop favorites={favorites} filter={Tags.Move} />,
    Meditate: <ContentLoop favorites={favorites} filter={Tags.Meditate} />,
    Learn: <ContentLoop favorites={favorites} filter={Tags.Learn} />,
    Sleep: <ContentLoop favorites={favorites} filter={Tags.Sleep} />,
  };

  return (
    <Container>
      <PageHeading title="Your Favorites" tabs={tabs} />
      <Tabs filters={tabs} />
    </Container>
  );
};

export default FavoritesScreen;
