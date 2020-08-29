import React from 'react';
import {
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  Spinner,
} from '../primitives';
import moment from 'moment';
import { TimeOfDay } from 'services';
import { useCurrentUser, useContent } from '../hooks';

const HomeScreen: React.FC = () => {
  const today = moment();
  const { translation } = useCurrentUser();
  const { features } = useContent();

  // Determine Time of Day
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = 'Start the day with some morning stretches';
  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
    tagline = 'Wind down from a long day';
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = 'Take some time for yourself this afternoon';
  }

  return (
    <Container scrollEnabled>
      <PageHeading
        title={translation[`Good ${timeOfDay.toLowerCase()}`]}
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
