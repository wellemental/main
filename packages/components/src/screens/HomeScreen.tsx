import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import {
  PageHeadingHome,
  Container,
  ContentLoop,
  CategoryLoop,
  Subheadline,
  Paragraph,
  TabsNB,
  AgeCards,
} from '../primitives';
import { VersionConfig } from 'services';
import { useCurrentUser, useContent, useConfig } from '../hooks';
import { getVersion } from 'react-native-device-info';
import variables from '../assets/native-base-theme/variables/wellemental';
import { getTimeOfDay, Tags, TimeOfDay, exploreRedirects } from 'common';

const HomeScreen: React.FC = ({ navigation }) => {
  const { translation, activePlan } = useCurrentUser();
  const { features } = useContent();

  const timeOfDay = getTimeOfDay();

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

  const timeOfDayColor =
    timeOfDay.name === TimeOfDay.Evening ? 'white' : undefined;

  return (
    <Container scrollEnabled bg={timeOfDay.name} proOnly={false}>
      {canUpgrade && data && !data.forceUpgrade && (
        <TouchableOpacity
          onPress={upgradeOnPress}
          style={{
            borderBottomColor: variables.brandDanger,
            borderBottomWidth: 1,
            paddingTop: 5,
            paddingBottom: 15,
            marginBottom: -10,
          }}>
          <Paragraph center>
            {translation['Tap to download the latest Wellemental update.']}
          </Paragraph>
        </TouchableOpacity>
      )}

      <PageHeadingHome timeOfDay={timeOfDay} color={timeOfDayColor} />

      {activePlan ? (
        <>
          <TabsNB color={timeOfDayColor} />

          {features && features.categories && (
            <CategoryLoop title="Featured" categories={features.categories} />
          )}
          <Subheadline color={timeOfDayColor}>
            {translation.Explore}
          </Subheadline>

          <AgeCards />

          <CategoryLoop
            hideTitle
            redirects={exploreRedirects}
            colors={['orange', 'teal']}
          />
        </>
      ) : (
        <>
          <Subheadline color={timeOfDayColor}>
            {translation.Featured}
          </Subheadline>
          <ContentLoop filter={Tags.Featured} />
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
