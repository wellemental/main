import React from 'react';
import {
  PageHeadingHome,
  ContentLoop,
  CategoryCard,
  CategoryLoop,
  Subheadline,
  Spinner,
  AgeCards,
} from '../primitives';
import moment from 'moment';
import {
  getTimeOfDay,
  TimeOfDay,
  Category,
  Tags,
  exploreRedirects,
} from 'common';
import { useCurrentUser, useContent } from '../hooks';
import { ageGroups } from '../constants';

const HomeScreen: React.FC = () => {
  const today = moment();
  const { activePlan } = useCurrentUser();
  const { features } = useContent();

  const timeOfDay = getTimeOfDay();
  const timeOfDayColor =
    timeOfDay.name === TimeOfDay.Evening ? 'white' : undefined;

  return (
    <>
      <PageHeadingHome timeOfDay={timeOfDay} color={timeOfDayColor} />

      {activePlan ? (
        <>
          {/* <TabsNB color={timeOfDayColor} /> */}

          {features && features.categories && (
            <CategoryLoop title="Featured" categories={features.categories} />
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

      {features && features.categories && (
        <CategoryLoop title="Featured" categories={features.categories} />
      )}
    </>
  );
};

export default HomeScreen;
