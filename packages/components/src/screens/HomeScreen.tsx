import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
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
import { VersionConfig } from 'common';
import {
  useCurrentUser,
  useContent,
  useConfig,
  useContainer,
  useQuery,
} from '../hooks';
import { getVersion } from 'react-native-device-info';
import {
  getTimeOfDay,
  colors,
  Tags,
  TimeOfDay,
  exploreRedirects,
  AuthorizationStatus,
  ObserveNotificationsType,
} from 'common';
import { MainNavigationProp } from '../types';

type Props = {
  navigation: MainNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { activePlan, user } = useCurrentUser();
  const { features, error } = useContent();

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
  let canUpgrade = false;
  // if there's a newer version available, display upgrade modal
  if (data) {
    canUpgrade = currVersion < data.version;
  }

  if (canUpgrade && data && data.forceUpgrade) {
    navigation.navigate('Upgrade', {
      version: data,
    });
  }

  const upgradeOnPress = (): void => {
    Linking.openURL(data.iosUrl).catch(err =>
      console.error('An error occurred', err),
    );
  };

  // Calculate time of day to determine bg and featured content
  const timeOfDay = getTimeOfDay();

  const timeOfDayColor =
    timeOfDay.name === TimeOfDay.Evening ? 'white' : undefined;

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
            <CategoryLoop title="Featured" categories={features} />
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
