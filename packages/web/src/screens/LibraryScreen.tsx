import React from 'react';
import {
  Tabs,
  ContentLoop,
  PageHeading,
  Box,
  TeacherLoop,
} from '../primitives';
import { Tags } from '../types';
import { Redirect } from 'react-router-dom';
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

  return activePlan ? (
    <>
      <Box my={1}>
        <PageHeading title={translation["Let's Practice."]} />
      </Box>

      <Tabs tabs={tabs} />
    </>
  ) : (
    <Redirect to="/plans" />
  );
};

export default LibraryScreen;
