import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import {
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  AgeCards,
  Spinner,
  TabsNB,
  Paragraph,
} from '../primitives';
import moment from 'moment';
import { TimeOfDay, VersionConfig } from 'services';
import { useCurrentUser, useContent, useConfig } from '../hooks';
import { getVersion } from 'react-native-device-info';
import variables from '../assets/native-base-theme/variables/wellemental';

const HomeScreen: React.FC = ({ navigation }) => {
  const today = moment();
  const { translation, activePlan } = useCurrentUser();
  const { features } = useContent();

  // Determine Time of Day for header customization
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = translation['Start the day with some morning stretches'];
  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
    tagline =
      translation['Get ready for bedtime with these soothing practices.'];
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = translation['Shake out the day with some fun movement.'];
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
    Linking.openURL(data.iosUrl).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  return (
    <Container scrollEnabled color="#fff">
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
          <Paragraph center style={{ color: variables.brandDanger }}>
            {translation['Tap to download the latest Wellemental update.']}
          </Paragraph>
        </TouchableOpacity>
      )}

      <PageHeading
        noHeader
        title={`${translation[`Good ${timeOfDay.toLowerCase()}`]}`}
        subtitle={tagline}
      />
      <ContentLoop filter={timeOfDay} />

      <TabsNB />

      {features && features.categories ? (
        <>
          <PageHeading subheader title={translation.Featured} />

          {features.categories.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      ) : (
        <Spinner />
      )}

      {activePlan && (
        <>
          <PageHeading
            subheader
            title={`${translation['Explore by age range']}`}
          />

          <AgeCards />

          {/* {ageGroups.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))} */}
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
