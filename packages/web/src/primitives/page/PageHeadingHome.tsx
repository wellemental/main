import React from 'react';
import PageHeading from './PageHeading';
import Box from '../utils/Box';
import Button from '../buttons/Button';
import {
  TimeOfDayObj,
  Content,
  getRandomInt,
  Colors,
  filterContent,
  TimeOfDay,
} from 'common';
import { useContent, useNavigation } from '../../hooks';

type Props = {
  timeOfDay: TimeOfDayObj;
  color?: Colors;
};

const PageHeadingHome: React.FC<Props> = ({ timeOfDay, color }) => {
  const { content, loading } = useContent();
  const navigation = useNavigation();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const filter: TimeOfDay = timeOfDay.name.toLowerCase() as TimeOfDay;

  filteredContent = filterContent(content, { tags: [filter] });

  const selectContent = (): Content => {
    // Get random piece of content to feature on load
    const totalItems = filteredContent.length;
    const idx = getRandomInt(totalItems);
    const selected = filteredContent[idx];
    return selected;
  };

  const selectedContent = selectContent();

  return (
    <Box mb={2} alignItems="center">
      <PageHeading
        withLogo
        center
        title={timeOfDay.headline}
        subtitle={timeOfDay.tagline}
        color={color ? color : undefined}
      />

      <Box mt={0.5} textAlign="center">
        <Button
          fullWidth={false}
          color={
            timeOfDay.name === TimeOfDay.Morning
              ? 'warning'
              : timeOfDay.name === TimeOfDay.Evening
              ? 'light'
              : 'primary'
          }
          text={timeOfDay.btnText}
          loading={loading}
          style={{ justifyContent: 'center' }}
          onPress={() =>
            navigation.navigate('Content', {
              content: selectedContent,
            })
          }
        />
      </Box>
    </Box>
  );
};

export default PageHeadingHome;
