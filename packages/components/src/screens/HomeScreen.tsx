import React from 'react';
import { Text } from 'react-native';
import {
  PageHeading,
  Container,
  ContentLoop,
  CategoryCard,
  Spinner,
} from '../primitives';
import moment from 'moment';
import { TimeOfDay } from 'services';
import { useCurrentUser, useConfig } from '../hooks';

const HomeScreen: React.FC = () => {
  const today = moment();
  const { translation } = useCurrentUser();
  const { loading, data } = useConfig('featured');

  console.log('LOAD', loading, 'DATA', !!data, 'CATEGORIES***', data);

  // const categories: Category[] = [
  //   {
  //     title: 'Category One',
  //     description: 'Lorem ipsum description and stuff.',
  //     tag: Tags.Featured,
  //     image:
  //       'https://media.wired.com/photos/5b8999943667562d3024c321/master/w_2560%2Cc_limit/trash2-01.jpg',
  //   },
  //   {
  //     title: 'Category One',
  //     description: 'Lorem ipsum description and stuff.',
  //     tag: Tags.Featured,
  //     image:
  //       'https://media.wired.com/photos/5b8999943667562d3024c321/master/w_2560%2Cc_limit/trash2-01.jpg',
  //   },
  // ];

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
      {!loading && data && data.categories ? (
        <>
          <PageHeading title={translation.Featured} />

          {data.categories.map((item, idx) => (
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
