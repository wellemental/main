import React, { useState } from 'react';
import { Platform } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
import { Card, CardItem } from 'native-base';
import {
  Error,
  PageHeading,
  Container,
  StatDisplay,
  Button,
  ListEmpty,
  TabsButtons,
  ContentLoop,
  Box,
  Spinner,
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
import SettingsScreen from '../screens/SettingsScreen';

const ProfileScreen: React.FC = () => {
  const { translation, user } = useCurrentUser();
  const { content } = useContent();
  const [error, setError] = useState();
  const navigation = useNavigation();

  const tabs: Tab[] = [
    { label: 'Stats' },
    { label: 'Journey' },
    { label: 'Favorites' },
  ];

  const [tab, setTab] = useState<string>(tabs[0].label);

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

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
    loadingMore: loadingMoreFav,
    hasMore: hasMoreFavs,
  } = useLoadMore(service.query, { limit: 7 });

  return (
    <Container scrollEnabled bg="Profile">
      <PageHeading noHeader title={translation.Profile} />

      <Error error={error} />

      <Card>
        <CardItem style={{ paddingBottom: 0, paddingTop: 0 }}>
          <TabsButtons tabs={tabs} active={tab} setState={setTab} />
        </CardItem>
      </Card>
      {tab === 'Favorites' && <ContentLoop favorites={favorites} />}

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
      {tab === 'Journey' &&
        (loading || !content ? (
          <Spinner />
        ) : (
          <>
            <List
              style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 5 }}>
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
                <ListEmpty>
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
          </>
        ))}
    </Container>
  );
};

export default ProfileScreen;
