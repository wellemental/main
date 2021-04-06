import React, { useState } from 'react';
import { PlaysServiceType } from 'services';
import { firestore } from 'firebase/app';
import {
  Error,
  PageHeading,
  Container,
  Card,
  StatDisplay,
  ContentLoopLoadMore,
  Tabs,
} from '../primitives';
import { FavoritesServiceType, PlayEvent } from 'common';
import { useCurrentUser, useContainer } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
// import { ProfileScreenRouteProp } from '../types';
import { convertTimestamp } from '../services/helpers';
import { Timestamp } from '../types';
import moment from 'moment';

const ProfileScreen: React.FC = () => {
  const { translation, user } = useCurrentUser();
  const [error, setError] = useState();

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
    <Container
    // bg="Profile"
    >
      <PageHeading title={translation.Profile} />

      <Error error={error} />

      <Tabs tabs={tabs} />
    </Container>
  );
};

export default ProfileScreen;
