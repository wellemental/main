import React from 'react';
import { Container, ContentLoopLoadMore, PageHeading } from '../primitives';
import { useContainer, useCurrentUser, useLoadMore } from '../hooks';
import { FavoritesServiceType } from 'common';

const FavoritesScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  const container = useContainer();
  const service = container.getInstance<FavoritesServiceType>(
    'favoritesService',
  );

  const {
    items: favorites,
    loading: favsLoading,
    loadMore: loadMoreFavs,
    loadingMore: loadingMoreFavs,
    hasMore: hasMoreFavs,
  } = useLoadMore(service.query, { limit: 7 });

  return (
    <Container scrollEnabled>
      <PageHeading noHeader title={translation['Your Favorites']} />

      <ContentLoopLoadMore
        items={favorites}
        loading={favsLoading}
        loadingMore={loadingMoreFavs}
        loadMore={loadMoreFavs}
        hasMore={hasMoreFavs}
      />
    </Container>
  );
};

export default FavoritesScreen;
