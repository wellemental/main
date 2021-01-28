import React, { useState } from 'react';
import { View } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
import {
  Error,
  PageHeading,
  Container,
  Button,
  ListEmpty,
  Tabs,
  Box,
  Headline,
  Spinner,
  ContentCard,
  Paragraph,
} from '../primitives';
import { List } from 'native-base';
import { MenuItem } from '../types';
import { useCurrentUser, useContent, useContainer } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import SettingsScreen from '../screens/SettingsScreen';

const ProfileScreen: React.FC = () => {
  const { auth, translation, user } = useCurrentUser();
  const { content, teachers } = useContent();
  const [error, setError] = useState();

  const tabs: MenuItem[] = [
    // { label: translation.Stats },
    { label: translation.Journey },
    { label: translation.Settings },
  ];

  const [tab, setTab] = useState(tabs[0]);

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

  const { items, loading, loadMore, loadingMore, hasMore } = useLoadMore(
    service.query,
  );

  return (
    <Container scrollEnabled noPadding="horizontal">
      <Box mx={2} row>
        <PageHeading title={translation.Profile} />
      </Box>
      <Box row mb={4} mx={3} justifyContent="space-between">
        <Box>
          <Headline small>{user.streak}</Headline>
          <Paragraph>{translation.Streak}</Paragraph>
        </Box>
        <Box>
          <Headline small>{user.totalCompleted}</Headline>
          <Paragraph>{translation['Sessions Completed']}</Paragraph>
        </Box>
        <Box>
          <Headline small>{user.totalSeconds}</Headline>
          <Paragraph>{translation['Total Hours']}</Paragraph>
        </Box>
      </Box>
      <Error error={error} />
      <Tabs tabs={tabs} active={tab} setTab={setTab} />
      {tab.label === translation.Journey &&
        (loading || !content || !teachers ? (
          <Spinner />
        ) : (
          <>
            <List style={{ marginHorizontal: 15 }}>
              {items && items.length > 0 ? (
                items.map((item, idx: number) => {
                  const data = item.data() as PlayEvent;
                  const contentMatch =
                    data && data.contentId && content[data.contentId];
                  const teacherMatch =
                    data &&
                    data.contentId &&
                    teachers[content[data.contentId].teacher];

                  return contentMatch && teacherMatch ? (
                    <View key={idx} style={{ marginVertical: 10 }}>
                      <Paragraph fine>
                        {convertTimestamp(data.createdAt).format(
                          'MMM DD, YYYY @ h:mm',
                        )}
                      </Paragraph>
                      <ContentCard
                        key={idx}
                        content={contentMatch}
                        teacher={teacherMatch}
                      />
                    </View>
                  ) : null;
                })
              ) : (
                <ListEmpty />
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
      {tab.label === translation.Settings && <SettingsScreen />}
    </Container>
  );
};

export default ProfileScreen;
