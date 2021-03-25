import React, { useState } from 'react';
import {
  PlaysServiceType,
  PlayEvent,
  convertTimestamp,
  FavoritesService,
} from 'services';
import {
  Error,
  PageHeading,
  Container,
  Card,
  CardBody,
  StatDisplay,
  // ContentLoopLoadMore,
  Button,
  ListEmpty,
  Tabs,
  Box,
  Loading,
  // RecentlyPlayedLoop,
} from '../primitives';
import { FavoritesServiceType, Languages, Tab } from 'common';
import {
  useCurrentUser,
  useContent,
  useLocation,
  useContainer,
  useNavigation,
} from '../hooks';
// import useLoadMore from '../hooks/useLoadMore';
// import { ProfileScreenRouteProp } from '../types';

const ProfileScreen: React.FC = () => {
  const { translation, user } = useCurrentUser();
  const { content } = useContent();
  const [error, setError] = useState();
  const navigation = useNavigation();
  const { state } = useLocation();
  const defaultTab = state && state.defaultTab;

  // const tabs: Tab[] = [
  //   { label: 'Stats' },
  //   { label: 'History' },
  //   { label: 'Favorites' },
  // ];

  const Stats = (
    <>
      <Card style={{ paddingTop: 0 }}>
        <StatDisplay type="streak" />
        <StatDisplay type="completed" />
        <StatDisplay type="time" last />
      </Card>
      <Box mt={1.5}>
        <Button
          iconName="cog"
          text="Settings"
          onPress={() => navigation.navigate('Settings')}
        />
      </Box>
    </>
  );

  const tabs: { [key: string]: JSX.Element } = {
    [translation.Stats]: Stats,
    [translation.History]: Stats,
    [translation.Favorites]: Stats,
  };

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

      <Tabs tabs={tabs} />

      {/* 
{tab === 'Favorites' && (
        <ContentLoopLoadMore
          items={favorites}
          loading={favsLoading}
          loadingMore={loadingMoreFavs}
          loadMore={loadMoreFavs}
          hasMore={hasMoreFavs}
        />
      )}
      {tab === 'History' && (
        <ContentLoopLoadMore
          recentlyPlayed
          loading={loading}
          items={items}
          hasMore={hasMore}
          loadingMore={loadingMore}
          loadMore={loadMore}
        />
      )} */}
    </Container>
  );
};

export default ProfileScreen;
