import React from 'react';
import { ContentLoop, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';

const FavoritesScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const favorites =
    user &&
    user.favorites &&
    Object.keys(user.favorites).filter(
      (item: string) => user.favorites[item].favorited,
    );

  return (
    <>
      <PageHeading title={translation['Your Favorites']} />
      <ContentLoop favorites={favorites} />
    </>
  );
};

export default FavoritesScreen;
