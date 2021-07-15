import React, { useEffect, useState } from 'react';
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
import { Tab } from 'common';
import { useCurrentUser, useNavigation, useMutation } from '../hooks';
import { ProfileScreenRouteProp } from '../types';
import { LocalStateService, rateApp, UpdateUserService } from 'services';

type Props = {
  route: ProfileScreenRouteProp;
};

const APP_REVIEW_ASKED = 'APP_REVIEW_ASKED';

const ProfileScreen: React.FC<Props> = ({ route }) => {
  const { translation, user } = useCurrentUser();
  const [error, setError] = useState();
  const navigation = useNavigation();
  const defaultTab = route && route.params && route.params.defaultTab;
  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(user.id, { askedAppReview: true }),
  );

  useEffect(() => {
    if (!user.askedAppReview) {
      const localStateService = new LocalStateService();
      localStateService.getStorage(APP_REVIEW_ASKED)
        .then((value) => {
          let count = Number(value);
          if (count > 2) {
            rateApp();
            mutate();
          } else {
            count++;
            localStateService.setStorage(APP_REVIEW_ASKED, count);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

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
