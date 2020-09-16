import React from 'react';
import {
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  Spinner,
} from '../primitives';
import moment from 'moment';
import { TimeOfDay, Version } from 'services';
import { useCurrentUser, useContent, useConfig } from '../hooks';
import { useNavigation } from '@react-navigation/native';
import { getVersion } from 'react-native-device-info';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const today = moment();
  const { translation, user } = useCurrentUser();
  const { features } = useContent();

  // Determine Time of Day for header customization
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = translation['Start the day with some morning stretches'];
  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
    tagline = translation['Shake out the day with some fun movement.'];
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline =
      translation['Get ready for bedtime with these soothing practices.'];
  }

  // Upgrade Screen prompt
  const { data } = useConfig<Version>('version');
  const currVersion = getVersion();
  let canUpgrade = false;
  // if there's a newer version available, display upgrade modal
  if (data) {
    canUpgrade = currVersion < data.version;

    if (canUpgrade) {
      navigation.navigate('Upgrade', { version: data });
    }
  }

  return (
    <Container scrollEnabled>
      <PageHeading
        title={`${translation[`Good ${timeOfDay.toLowerCase()}`]}${
          user && user.name && `, ${user.name}`
        }`}
        subtitle={tagline}
      />

      <ContentLoop filter={timeOfDay} />
      {features && features.categories ? (
        <>
          <PageHeading title={translation.Featured} />

          {features.categories.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      ) : (
        <Spinner />
      )}
      {/* <ContentLoop filter={Tags.Featured} /> */}
    </Container>
  );
};

export default HomeScreen;
