import React, { useState, useEffect } from 'react';
import PageHeading from './PageHeading';
import Box from '../utils/Box';
import { LayoutAnimation } from 'react-native';
import Button from '../buttons/Button';
import {
  TimeOfDayObj,
  Content,
  getRandomInt,
  Colors,
  TimeOfDay,
  Filter,
} from 'common';
import { useContent, useCurrentUser, useNavigation } from '../../hooks';

type Props = {
  timeOfDay: TimeOfDayObj;
  color?: Colors;
};

const PageHeadingHome: React.FC<Props> = ({ timeOfDay, color }) => {
  const { content, loading } = useContent();
  const { user } = useCurrentUser();
  const [show, toggleShow] = useState(false);
  const navigation = useNavigation();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const filter: TimeOfDay = timeOfDay.name;

  if (filter && filteredContent) {
    filteredContent = filteredContent.filter(
      (item: Content) =>
        item &&
        item.tags &&
        item.tags.includes(filter.toLowerCase() as Filter) &&
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

  useEffect(() => {
    if (selectedContent) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toggleShow(true);
    }
  }, [selectedContent]);

  return (
    <Box mb={2} alignItems="center">
      <PageHeading
        noHeader
        withLogo
        center
        title={timeOfDay.headline}
        subtitle={timeOfDay.tagline}
        color={color ? color : undefined}
      />

      {show && (
        <Box mt={0.5}>
          <Button
            light={timeOfDay.name === TimeOfDay.Evening}
            warning={timeOfDay.name === TimeOfDay.Morning}
            text={timeOfDay.btnText}
            loading={loading}
            onPress={() =>
              navigation.navigate('Content', {
                content: selectedContent,
              })
            }
          />
        </Box>
      )}
    </Box>
  );
};

export default PageHeadingHome;
