import React, { useState, useRef, useEffect } from 'react';
import PageHeading from './PageHeading';
import Box from './Box';
import { LayoutAnimation } from 'react-native';
import Button from './Button';
import { TimeOfDayObj, Content, getRandomInt, Tags, Teacher } from 'common';
import { useContent, useNavigation } from '../hooks';

type Props = {
  timeOfDay: TimeOfDayObj;
};

const PageHeadingHome: React.FC<Props> = ({ timeOfDay }) => {
  const { content, loading, getTeacher } = useContent();
  const navigation = useNavigation();
  let filteredContent: Content[] = content ? Object.values(content) : [];
  const filter = timeOfDay.name;

  if (filter && filteredContent) {
    filteredContent = filteredContent.filter((item: Content) =>
      item.tags.includes(filter.toLowerCase()),
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

  const [show, toggleShow] = useState(false);

  useEffect(() => {
    if (selectedContent) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toggleShow(true);
    }
  }, [selectedContent]);

  console.log('time OF DAY', timeOfDay);

  return (
    <Box mb={2} alignItems="center">
      <PageHeading
        noHeader
        withLogo
        center
        title={timeOfDay.headline}
        subtitle={timeOfDay.tagline}
      />

      {show && (
        <Box mt={-0.5}>
          <Button
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
