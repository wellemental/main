import React, { useState } from 'react';
import { Platform } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
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
  ContentLoop,
  Box,
  Loading,
  ContentCardSmall,
} from '../primitives';
import { List } from 'native-base';
import { Tab } from 'common';
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
  const { translation } = useCurrentUser();
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

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
    lastLoaded,
  } = useLoadMore(service.query, { limit: 7 });

  const {
    items: favorites,
    loading: favsLoading,
    loadMore: loadMoreFavs,
    loadingMore: loadingMoreFavs,
    hasMore: hasMoreFavs,
    lastLoaded: lastFavLoaded,
  } = useLoadMore(service.query, { limit: 7 });

  console.log('LSAST LOADED', lastLoaded, 'FAVS', lastFavLoaded);
  return (
    <Container scrollEnabled bg="Profile">
      <PageHeading noHeader title={translation.Profile} />

      <Error error={error} />

      <Card>
        <CardItem style={{ paddingBottom: 0, paddingTop: 0 }}>
          <TabsButtons tabs={tabs} active={tab} setState={setTab} />
        </CardItem>
      </Card>
      {tab === 'Favorites' && (
        <ContentLoopLoadMore
          items={favorites}
          loading={favsLoading}
          loadingMore={loadingMoreFavs}
          loadMore={loadMore}
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
        <Loading loading={loading || !content}>
          <List>
            {items && items.length > 0 ? (
              items.map((item, idx: number) => {
                const data = item.data() as PlayEvent;
                const contentMatch =
                  data && data.contentId && content[data.contentId];

                return contentMatch ? (
                  <ContentCardSmall
                    key={idx}
                    content={contentMatch}
                    recentDate={convertTimestamp(data.createdAt).format(
                      'MMM DD, YYYY',
                    )}
                  />
                ) : null;
              })
            ) : (
              <ListEmpty center>
                {
                  translation[
                    'Your recently played videos will appear here. Get started!'
                  ]
                }
              </ListEmpty>
            )}
            {hasMore && (
              <Button
                transparent
                disabled={loadingMore}
                text={translation['Load More']}
                onPress={loadMore}
              />
            )}
          </List>
        </Loading>
      )}
    </Container>
  );
};

export default ProfileScreen;
