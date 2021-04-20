import React, { useState } from 'react';
import {
  Error,
  PageHeading,
  Card,
  StatDisplay,
  ContentLoopLoadMore,
  Tabs,
} from '../primitives';
import { useCurrentUser, useLocation } from '../hooks';

const ProfileScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [error, setError] = useState();
  const { state } = useLocation();

  const activeTab = state && state.defaultTab === 'History' ? 1 : 0;

  const Stats = (
    <Card style={{ paddingTop: 0 }}>
      <StatDisplay type="streak" />
      <StatDisplay type="completed" />
      <StatDisplay type="time" last />
    </Card>
  );

  const tabs: { [key: string]: JSX.Element } = {
    [translation.Stats]: Stats,
    [translation.History]: <ContentLoopLoadMore type="history" />,
    [translation.Favorites]: <ContentLoopLoadMore type="favorites" />,
  };

  return (
    <>
      <PageHeading title={translation.Profile} />

      <Error error={error} />

      <Tabs tabs={tabs} value={activeTab} />
    </>
  );
};

export default ProfileScreen;
