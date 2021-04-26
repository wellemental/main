import React, { useState } from 'react';
import {
  Tabs,
  Container,
  ContentLoop,
  PageHeading,
  TeacherLoop,
} from '../primitives';
import { PlansScreen } from '../screens';
import { useCurrentUser } from '../hooks';
import { MenuItem, Tags } from 'common';

const LibraryScreen: React.FC = () => {
  const { translation, activePlan } = useCurrentUser();

  const tabs: MenuItem[] = [
    { label: translation.All, filter: 'All' },
    { label: translation.Move, filter: Tags.Move },
    { label: translation.Meditate, filter: Tags.Meditate },
    { label: translation.Learn, filter: Tags.Learn },
    { label: translation.Sleep, filter: Tags.Sleep },
    { label: translation.Teachers },
  ];

  const [tab, setTab] = useState(tabs[0]);

  return activePlan ? (
    <Container scrollEnabled noPadding="horizontal">
      <PageHeading noHeader title={translation["Let's Practice."]} />

      <Tabs tabs={tabs} active={tab} setTab={setTab} />

      {tab.label === translation.Teachers ? (
        <TeacherLoop scrollEnabled />
      ) : (
        <ContentLoop filter={tab.filter === 'All' ? undefined : tab.filter} />
      )}
    </Container>
  ) : (
    <PlansScreen />
  );
};

export default LibraryScreen;
