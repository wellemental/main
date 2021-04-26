import React, { useState } from 'react';
import { Card, CardItem } from 'native-base';
import {
  Error,
  PageHeading,
  Container,
  StatDisplay,
  ContentLoopLoadMore,
  Button,
  TabsButtons,
  Box,
} from '../primitives';
import { FavoritesServiceType, Tab } from 'common';
import { useCurrentUser, useContainer, useNavigation } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import { ProfileScreenRouteProp } from '../types';

type Props = {
  route: ProfileScreenRouteProp;
};

const ProfileScreen: React.FC<Props> = ({ route }) => {
  const { translation } = useCurrentUser();
  const [error, setError] = useState();
  const navigation = useNavigation();
  const defaultTab = route && route.params && route.params.defaultTab;

  const tabs: Tab[] = [
    { label: 'Stats', icon: 'stats' },
    { label: 'History', icon: 'history' },
    { label: 'Favorites', icon: 'favorite' },
  ];

  const [tab, setTab] = useState<string>(
    defaultTab ? defaultTab : tabs[0].label,
  );

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
            iconsOnly
            full={true}
            tabs={tabs}
            active={tab}
            setState={setTab}
          />
        </CardItem>
      </Card>
      {tab === 'Favorites' && <ContentLoopLoadMore type="favorites" />}
      {tab === 'History' && <ContentLoopLoadMore type="history" />}

      {tab === 'Stats' && (
        <>
          <Card style={{ paddingTop: 0 }}>
            <StatDisplay type="streak" />
            <StatDisplay type="completed" />
            <StatDisplay type="time" last />
          </Card>
          <Box mt={1.5}>
            <Button
              icon="settings"
              text={translation.Settings}
              onPress={() => navigation.navigate('Settings')}
            />
          </Box>
        </>
      )}
    </Container>
  );
};

export default ProfileScreen;
