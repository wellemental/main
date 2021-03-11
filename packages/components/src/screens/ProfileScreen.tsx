import React, { useState } from 'react';
import {
  PlaysServiceType,
  PlayEvent,
  convertTimestamp,
  FavoritesService,
} from 'services';
import { Card, CardItem } from 'native-base';
import {
  Error,
  PageHeading,
  Container,
  StatDisplay,
  ContentLoopLoadMore,
  Button,
  ListEmpty,
  TabsButtons,
  Box,
  Loading,
  ContentCardSmall,
  RecentlyPlayedLoop,
} from '../primitives';
import { List } from 'native-base';
import { FavoritesServiceType, Languages, Tab } from 'common';
import {
  useCurrentUser,
  useContent,
  useContainer,
  useNavigation,
} from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import { ProfileScreenRouteProp } from '../types';

type Props = {
  route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<Props> = ({ route }) => {
  const { translation, user } = useCurrentUser();
  const { content } = useContent();
  const [error, setError] = useState();
  const navigation = useNavigation();
  const defaultTab = route && route.params && route.params.defaultTab;

  const tabs: Tab[] = [
    { label: 'Stats' },
    { label: 'Journey' },
    { label: 'Favorites' },
  ];

  const [tab, setTab] = useState<string>(
    defaultTab ? defaultTab : tabs[0].label,
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
  } = useLoadMore(service.query, { limit: 7 });

  const {
    items: favorites,
    loading: favsLoading,
    loadMore: loadMoreFavs,
    loadingMore: loadingMoreFavs,
    hasMore: hasMoreFavs,
  } = useLoadMore(favsService.query, { limit: 7 });

  return (
    <Container scrollEnabled bg="Profile">
      <PageHeading noHeader title={translation.Profile} />

      <Error error={error} />

      <Card>
        <CardItem
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 7,
            paddingRight: 7,
          }}>
          <TabsButtons
            full={user.language === Languages.En}
            tabs={tabs}
            active={tab}
            setState={setTab}
          />
        </CardItem>
      </Card>
      {tab === 'Favorites' && (
        <ContentLoopLoadMore
          items={favorites}
          loading={favsLoading}
          loadingMore={loadingMoreFavs}
          loadMore={loadMoreFavs}
          hasMore={hasMoreFavs}
        />
      )}

      {tab === 'Stats' && (
        <>
          <Card style={{ paddingTop: 0 }}>
            <StatDisplay type="streak" />
            <StatDisplay type="completed" />
            <StatDisplay type="time" last />
          </Card>
          <Box mt={1.5}>
            <Button
              warning
              iconName="settings"
              iconType="Feather"
              text={translation.Settings}
              onPress={() => navigation.navigate('Settings')}
            />
          </Box>
        </>
      )}
      {tab === 'Journey' && (
        <ContentLoopLoadMore
          recentlyPlayed
          loading={loading}
          items={items}
          hasMore={hasMore}
          loadingMore={loadingMore}
          loadMore={loadMore}
        />
      )}
    </Container>
  );
};

export default ProfileScreen;
