import React from 'react';
import { PageHeading, ContentLoop, CategoryCard, Spinner } from '../primitives';
import moment from 'moment';
import { TimeOfDay, Category } from '../types';
import { useCurrentUser, useContent } from '../hooks';
import { ageGroups } from '../constants';

const HomeScreen: React.FC = () => {
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

      {activePlan && (
        <>
          <PageHeading title={`${translation['Explore by age range']}`} />
          {ageGroups.map((item: Category, idx: number) => (
            <CategoryCard key={idx} category={item} />
          ))}
        </>
      )}
    </>
  );
};

export default HomeScreen;
