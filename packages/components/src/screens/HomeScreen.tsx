import React from 'react';
import { H1 } from 'native-base';
import { PageHeading, Container, Paragraph, ContentLoop } from '../primitives';
import moment from 'moment';
import { Tags } from 'services';
import { TimeOfDay } from 'services';

const HomeScreen: React.FC = () => {
  const today = moment();

  // Determine Time of Day
  let timeOfDay: TimeOfDay = TimeOfDay.Morning;
  let tagline = 'Start the day with some morning stretches';
  if (
    today.isAfter(moment().hour(19), 'hour') ||
    today.isBefore(moment().hour(4), 'hour')
  ) {
    timeOfDay = TimeOfDay.Evening;
  } else if (today.isAfter(moment().hour(12), 'hour')) {
    timeOfDay = TimeOfDay.Afternoon;
  }

  return (
    <Container scrollEnabled>
      <PageHeading
        title={`Good ${timeOfDay.toLowerCase()}`}
        subtitle={tagline}
      />
      <ContentLoop filter={timeOfDay} />
      <PageHeading title="Featured" />
      <ContentLoop filter={Tags.Featured} />
    </Container>
  );
};

export default HomeScreen;
