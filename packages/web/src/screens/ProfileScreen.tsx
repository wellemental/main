import React, { useState } from 'react';
import {
  PlaysServiceType,
  PlayEvent,
  convertTimestamp,
  FavoritesService,
} from 'services';
// import { Card, CardItem } from 'native-base';
import {
  Error,
  PageHeading,
  Container,
  // StatDisplay,
  // ContentLoopLoadMore,
  Button,
  ListEmpty,
  // TabsButtons,
  Box,
  Loading,
  // RecentlyPlayedLoop,
} from '../primitives';
import { FavoritesServiceType, Languages, Tab } from 'common';
import {
  useCurrentUser,
  useContent,
  useContainer,
  // useNavigation,
} from '../hooks';
// import useLoadMore from '../hooks/useLoadMore';
// import { ProfileScreenRouteProp } from '../types';

type Props = {
  // route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<Props> = () => {
  const { translation, user } = useCurrentUser();
  const { content } = useContent();
  const [error, setError] = useState();
  // const navigation = useNavigation();
  // const defaultTab = route && route.params && route.params.defaultTab;

  const tabs: Tab[] = [
    { label: 'Stats' },
    { label: 'History' },
    { label: 'Favorites' },
  ];

  // const [tab, setTab] = useState<string>(
  //   defaultTab ? defaultTab : tabs[0].label,
  // );

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');
  const favsService = container.getInstance<FavoritesServiceType>(
    'favoritesService',
  );

  // const {
  //   items,
  //   loading,
  //   loadMore,
  //   loadingMore,
  //   hasMore,
  // } = useLoadMore(service.query, { limit: 7 });

  // const {
  //   items: favorites,
  //   loading: favsLoading,
  //   loadMore: loadMoreFavs,
  //   loadingMore: loadingMoreFavs,
  //   hasMore: hasMoreFavs,
  // } = useLoadMore(favsService.query, { limit: 7 });

  return (
    <Container
    // bg="Profile"
    >
      <PageHeading
        // noHeader
        title={translation.Profile}
      />

      <Error error={error} />
    </Container>
  );
};

export default ProfileScreen;
