import React from 'react';
import { PageHeading, Container, ContentLoop } from '../primitives';
import moment from 'moment';
import { Tags } from 'services';
import { TimeOfDay } from 'services';
import { useCurrentUser } from '../hooks';

const HomeScreen: React.FC = () => {
  const today = moment();
  const { translation } = useCurrentUser();

  // Determine Time of Day
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = 'Start the day with some morning stretches';
  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
    tagline = 'Take some time for yourself this afternoon';
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
    tagline = 'Wind down from a long day';
  }

  return (
    <Container scrollEnabled>
      <PageHeading
        title={translation[`Good ${timeOfDay.toLowerCase()}`]}
        subtitle={tagline}
      />
      <ContentLoop filter={timeOfDay} />
      <PageHeading title={translation.Featured} />
      <ContentLoop filter={Tags.Featured} />
    </Container>
  );
};

export default HomeScreen;
