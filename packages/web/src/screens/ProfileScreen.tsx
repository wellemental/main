import React, { useState } from 'react';
import {
  Error,
  PageHeading,
  Card,
  StatDisplay,
  ContentLoopLoadMore,
  Tabs,
} from '../primitives';
import { FavoritesServiceType, PlaysServiceType } from 'common';
import { useCurrentUser, useContainer, useLocation } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';

const ProfileScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [error, setError] = useState();
  const { state } = useLocation();

  const activeTab = state && state.defaultTab === 'History' ? 1 : 0;

  const Stats = (
    <Card style={{ paddingTop: 0 }}>
      <StatDisplay type="streak" />
      <StatDisplay type="completed" />
      <StatDisplay type="time" last />
    </Card>
  );

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');
  const favsService = container.getInstance<FavoritesServiceType>(
    'favoritesService',
  );

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
    // @ts-ignore
  } = useLoadMore(service.query, { limit: 7 });

  const {
    items: favorites,
    loading: favsLoading,
    loadMore: loadMoreFavs,
    loadingMore: loadingMoreFavs,
    hasMore: hasMoreFavs,
  } = useLoadMore(favsService.query, { limit: 7 });

  const tabs: { [key: string]: JSX.Element } = {
    [translation.Stats]: Stats,
    [translation.History]: (
      <ContentLoopLoadMore
        recentlyPlayed
        loading={loading}
        items={items}
        hasMore={hasMore}
        loadingMore={loadingMore}
        loadMore={loadMore}
      />
    ),
    [translation.Favorites]: (
      <ContentLoopLoadMore
        items={favorites}
        loading={favsLoading}
        loadingMore={loadingMoreFavs}
        loadMore={loadMoreFavs}
        hasMore={hasMoreFavs}
      />
    ),
  };

  return (
    <>
      <PageHeading title={translation.Profile} />

      <Error error={error} />

      <Tabs tabs={tabs} value={activeTab} />
    </>
  );
};

export default ProfileScreen;
