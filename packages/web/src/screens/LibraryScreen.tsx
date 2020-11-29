import React, { useState } from 'react';
import {
  Tabs,
  //   Container,
  ContentLoop,
  PageHeading,
  Box,
  TeacherLoop,
} from '../primitives';
import { PlansScreen } from '../screens';
import { Tags, MenuItem } from '../types';
import { useCurrentUser } from '../hooks';

const LibraryScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

  const tabs: { [key: string]: JSX.Element } = {
    [translation.All]: <ContentLoop />,
    [translation.Move]: <ContentLoop filter={Tags.Move} />,
    [translation.Meditate]: <ContentLoop filter={Tags.Meditate} />,
    [translation.Learn]: <ContentLoop filter={Tags.Learn} />,
    [translation.Sleep]: <ContentLoop filter={Tags.Sleep} />,
    [translation.Teachers]: <TeacherLoop />,
  };

  // const [tab, setTab] = useState(tabs[0]);

  return !activePlan ? (
    <>
      <Box my={1}>
        <PageHeading title={translation["Let's Practice."]} />
      </Box>

      <Tabs tabs={tabs} />

      {/* {tab.label === translation.Teachers ? (
        <TeacherLoop scrollEnabled />
      ) : (
        <ContentLoop
          hasPadding
          filter={tab.filter === 'All' ? undefined : tab.filter}
        />
      )} */}
    </>
  ) : (
    <PlansScreen />
  );
};

export default LibraryScreen;
