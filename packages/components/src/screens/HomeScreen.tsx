import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import {
  PageHeadingHome,
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  Button,
  AgeCards,
  Spinner,
  Paragraph,
  TabsNB,
} from '../primitives';
import { VersionConfig } from 'services';
import { useCurrentUser, useContent, useConfig } from '../hooks';
import { getVersion } from 'react-native-device-info';
import variables from '../assets/native-base-theme/variables/wellemental';
import { getTimeOfDay } from 'common';

const HomeScreen: React.FC = ({ navigation }) => {
  const { translation, activePlan } = useCurrentUser();
  const { features } = useContent();

  const timeOfDay = getTimeOfDay(translation);

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
    Linking.openURL(data.iosUrl).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  return (
    <Container scrollEnabled bg="Afternoon">
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

      <PageHeadingHome timeOfDay={timeOfDay} />

      <TabsNB />

      {features && features.categories && (
        <>
          <PageHeading subheader title={translation.Featured} />

          {features.categories.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      )}

      {activePlan && (
        <>
          <PageHeading
            subheader
            title={`${translation['Explore by age range']}`}
          />

          <AgeCards />
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
