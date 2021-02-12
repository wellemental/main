import React from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import {
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  Spinner,
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
  const { features, error, updateAvailable } = useContent();

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

  const ageGroups = [
    {
      title: translation['Under 4 years'],
      description: translation['Simple practices for early learners'],
      image: require('../assets/images/age_under_4.png'),
      tag: 'toddler',
    },
    {
      title: translation['4–9 year olds'],
      description: translation['Elementary mindful practices'],
      image: require('../assets/images/age_4_9.png'),
      tag: 'PreK-5',
    },
    {
      title: translation['10–14 year olds'],
      description: translation['Practices designed for middle-school learning'],
      image: require('../assets/images/age_10_14.png'),
      tag: '6-8',
    },
    {
      title: translation['14–18 year olds'],
      description: translation['Resources for mindful development'],
      image: require('../assets/images/age_14_18.png'),
      tag: '9-12',
    },
  ];

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
          {ageGroups.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
