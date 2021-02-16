import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
import {
  Error,
  PageHeading,
  Container,
  StatDisplay,
  Button,
  ListEmpty,
  Tabs,
  Box,
  Headline,
  Spinner,
  ContentCardSmall,
  Paragraph,
} from '../primitives';
import { List } from 'native-base';
import { MenuItem } from '../types';
import { useCurrentUser, useContent, useContainer } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import SettingsScreen from '../screens/SettingsScreen';

const ProfileScreen: React.FC = () => {
  const { translation, user } = useCurrentUser();
  const { content, teachers } = useContent();
  const [error, setError] = useState();

  const tabs: MenuItem[] = [
    { label: 'Stats' },
    { label: 'Journey' },
    { label: 'Settings' },
  ];

  const [tab, setTab] = useState(tabs[0]);

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
  } = useLoadMore(service.query, { limit: 7 });

  return (
    <Container scrollEnabled>
      <PageHeading noHeader withLogo center title={translation.Profile} />

      <Error error={error} />

      <Tabs tabs={tabs} active={tab} setTab={setTab} />
      {tab.label === 'Stats' && (
        <>
          <StatDisplay type="streak" />
          <StatDisplay type="completed" />
          <StatDisplay type="time" />
        </>
      )}
      {tab.label === 'Journey' &&
        (loading || !content || !teachers ? (
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
                  const teacherMatch =
                    data &&
                    data.contentId &&
                    content[data.contentId] &&
                    teachers[content[data.contentId].teacher];

                  return contentMatch && teacherMatch ? (
                    <ContentCardSmall
                      key={idx}
                      content={contentMatch}
                      teacher={teacherMatch}
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
      {tab.label === 'Settings' && <SettingsScreen />}
    </Container>
  );
};

export default ProfileScreen;
