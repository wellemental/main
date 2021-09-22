import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Linking, Platform } from 'react-native';
import {
  PageHeadingHome,
  Container,
  ContentLoop,
  CategoryLoop,
  Subheadline,
  Paragraph,
  Error,
  HomepageTabs,
  AgeCards,
} from '../primitives';
import { VersionConfig, appStoreUrl } from 'common';
import {
  useCurrentUser,
  useContent,
  useConfig,
  useContainer,
  useQuery,
} from '../hooks';
import { getVersion } from 'react-native-device-info';
import {
  LocalStateServiceType,
  getTimeOfDay,
  colors,
  Tags,
  TimeOfDay,
  exploreRedirects,
  AuthorizationStatus,
  ObserveNotificationsType,
} from 'common';
import { LocalStateService } from 'services';
import { MainNavigationProp } from '../types';

type Props = {
  navigation: MainNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { activePlan, user } = useCurrentUser();
  const { features, error } = useContent();
  const localState: LocalStateServiceType = new LocalStateService();
  const [canUpgrade, setCanUpgrade] = useState(false);

  // Prompt to activate notifications if they haven't already been asked
  const container = useContainer();
  const service = container.getInstance<ObserveNotificationsType>(
    'observeNotifications',
  );

  const {
    data: notifPermission,
    error: notifError,
  } = useQuery<AuthorizationStatus>(service.checkPermissions);

  if (
    !user.promptedNotification &&
    notifPermission === AuthorizationStatus.NOT_DETERMINED
  ) {
    navigation.navigate('Notifications', { prompt: true });
  }

  // Upgrade Screen prompt
  const { data } = useConfig<VersionConfig>('version');
  const currVersion = getVersion();

  const upgradeOnPress = (): void => {
    Linking.openURL(appStoreUrl[Platform.OS]).catch(err =>
      console.error('An error occurred', err),
    );
  };

  const showUpgradeNotice = async () => {
    const dateShown = await localState.getUpgradeNoticeTime();
    if (canUpgrade && data && data.forceUpgrade && dateShown !== new Date().toLocaleDateString()) {
      if (!__DEV__ || true) {
        localState.setUpgradeNoticeTime();
        navigation.navigate('Upgrade', {
          version: data,
        });
      }
    }
  };

  // Calculate time of day to determine bg and featured content
  const timeOfDay = getTimeOfDay();

  const timeOfDayColor =
    timeOfDay.name === TimeOfDay.Evening ? 'white' : undefined;

  useEffect(() => {
    let canUpgrade = false;

    // if there's a newer version available, display upgrade modal
    if (data) {
      if (Platform.OS === 'android') {
        canUpgrade = currVersion < data.versionAndroid;
      } else {
        canUpgrade = currVersion < data.version;
      }
    }
    setCanUpgrade(canUpgrade);
  }, [data]);
  useEffect(() => {
    showUpgradeNotice();
  }, [canUpgrade]);
  return (
    <Container scrollEnabled bg={timeOfDay.name}>
      <Error error={error || notifError} />
      {canUpgrade && data && !data.forceUpgrade && (
        <TouchableOpacity
          onPress={upgradeOnPress}
          style={{
            borderBottomColor: colors.danger,
            borderBottomWidth: 1,
            paddingTop: 5,
            paddingBottom: 15,
            marginBottom: -10,
          }}>
          <Paragraph center>
            Tap to download the latest Wellemental update.
          </Paragraph>
        </TouchableOpacity>
      )}

      <PageHeadingHome timeOfDay={timeOfDay} color={timeOfDayColor} />

      {activePlan ? (
        <>
          <HomepageTabs color={timeOfDayColor} />

          {features && features && (
            <CategoryLoop
              title="Featured"
              categories={features}
              color={timeOfDayColor}
            />
          )}
          <Subheadline color={timeOfDayColor}>Explore</Subheadline>

          <AgeCards />

          <CategoryLoop
            hideTitle
            redirects={exploreRedirects}
            colors={['orange', 'teal']}
          />
        </>
      ) : (
        <>
          <Subheadline color={timeOfDayColor}>Featured</Subheadline>
          <ContentLoop filter={Tags.Featured} />
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
