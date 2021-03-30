import React from 'react';
import {
  PageHeadingHome,
  ContentLoop,
  CategoryLoop,
  Subheadline,
  HomepageTabs,
  AgeCards,
} from '../primitives';
import {
  getTimeOfDay,
  TimeOfDay,
  Category,
  Tags,
  exploreRedirects,
} from 'common';
import { useCurrentUser, useContent } from '../hooks';

const HomeScreen: React.FC = () => {
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
          <HomepageTabs color={timeOfDayColor} />

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
    </>
  );
};

export default HomeScreen;
