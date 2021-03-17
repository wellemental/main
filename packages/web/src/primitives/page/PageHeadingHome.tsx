import React, { useState, useEffect } from 'react';
import PageHeading from './PageHeading';
import Box from '../utils/Box';
import Button from '../buttons/Button';
import {
  TimeOfDayObj,
  Content,
  getRandomInt,
  Colors,
  TimeOfDay,
  Tags,
} from 'common';
import { useContent, useCurrentUser, useNavigation } from '../../hooks';

type Props = {
  timeOfDay: TimeOfDayObj;
  color?: Colors;
};

const PageHeadingHome: React.FC<Props> = ({ timeOfDay, color }) => {
  const { content, loading } = useContent();
  const { user } = useCurrentUser();
  const navigation = useNavigation();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const filter: TimeOfDay = timeOfDay.name.toLowerCase() as TimeOfDay;

  if (filter && filteredContent) {
    filteredContent = filteredContent.filter(
      (item: Content) =>
        item &&
        item.tags &&
        item.tags.includes(filter) &&
        item.language === user.language,
    );
  }

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
          // light={timeOfDay.name === TimeOfDay.Evening}
          // warning={timeOfDay.name === TimeOfDay.Morning}
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
