import React from 'react';
// import { TouchableOpacity, Linking } from 'react-native';
import {
  PageHeading,
  // Container,
  ContentLoop,
  CategoryCard,
  Spinner,
  Paragraph,
} from '../primitives';
import moment from 'moment';
import { TimeOfDay, Category, Tags } from '../types';
import { useCurrentUser, useContent } from '../hooks';

const HomeScreen: React.FC = () => {
  const today = moment();
  const { translation, activePlan } = useCurrentUser();
  const { features, rcLoading } = useContent();

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

  const ageGroups: Category[] = [
    {
      title: translation['Under 4 years'],
      description: translation['Simple practices for early learners'],
      image: require('../assets/images/age_under_4.png'),
      tag: Tags.Toddler,
    },
    {
      title: translation['4–9 year olds'],
      description: translation['Elementary mindful practices'],
      image: require('../assets/images/age_4_9.png'),
      tag: Tags.PreK,
    },
    {
      title: translation['10–14 year olds'],
      description: translation['Practices designed for middle-school learning'],
      image: require('../assets/images/age_10_14.png'),
      tag: Tags['6-8'],
    },
    {
      title: translation['14–18 year olds'],
      description: translation['Resources for mindful development'],
      image: require('../assets/images/age_14_18.png'),
      tag: Tags['9-12'],
    },
  ];

  return (
    <>
      <PageHeading
        title={`${translation[`Good ${timeOfDay.toLowerCase()}`]}`}
        subtitle={tagline}
      />
      <ContentLoop filter={timeOfDay} />

      {features && features.categories ? (
        <>
          <PageHeading title={translation.Featured} />

          {features.categories.map((item, idx: number) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      ) : (
        <Spinner />
      )}

      {!activePlan && (
        <>
          <PageHeading title={`${translation['Explore by age range']}`} />
          {ageGroups.map((item, idx) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      )}
    </>
  );
};

export default HomeScreen;
