import React from 'react';
import { Container, ContentLoop, PageHeading, Tabs } from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';
import { TabsType } from '../types';

const FavoritesScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const favorites =
    user &&
    user.favorites &&
    Object.keys(user.favorites).filter(
      (item: string) => user.favorites[item].favorited,
    );

  const tabs: TabsType = {
    [translation.All]: <ContentLoop favorites={favorites} />,
    [translation.Move]: (
      <ContentLoop favorites={favorites} filter={Tags.Move} />
    ),
    [translation.Meditate]: (
      <ContentLoop favorites={favorites} filter={Tags.Meditate} />
    ),
    [translation.Learn]: (
      <ContentLoop favorites={favorites} filter={Tags.Learn} />
    ),
    [translation.Sleep]: (
      <ContentLoop favorites={favorites} filter={Tags.Sleep} />
    ),
  };

  return (
    <Container scrollEnabled={false}>
      <PageHeading title={translation['Your Favorites']} tabs={tabs} />
      <Tabs filters={tabs} />
    </Container>
  );
};

export default FavoritesScreen;
