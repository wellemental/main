import React, { useState } from 'react';
import {
  Tabs,
  Container,
  ContentLoop,
  PageHeading,
  TeacherLoop,
} from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';

const LibraryScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [filter, setFilter] = useState<Tags | 'All' | 'Teachers'>('All');

  console.log('FILTER', filter);

  const tabs = {
    [translation.All]: <ContentLoop key="All" />,
    [translation.Move]: <ContentLoop key="Move" filter={Tags.Move} />,
    [translation.Meditate]: (
      <ContentLoop key="Meditate" filter={Tags.Meditate} />
    ),
    [translation.Learn]: <ContentLoop key="Learn" filter={Tags.Learn} />,
    [translation.Sleep]: <ContentLoop key="Sleep" filter={Tags.Sleep} />,
    [translation.Teachers]: <TeacherLoop key="Teachers" />,
  };

  // const tabs = [
  //   [undefined, translation.All],
  //   [Tags.Move, translation.Move],
  //   [Tags.Meditate, translation.Meditate],
  //   [Tags.Learn, translation.Learn],
  //   [Tags.Sleep, translation.Sleep],
  //   ['Teachers', translation.Teachers],
  // ];

  // const header = (
  //   <>
  //     <PageHeading title={translation["Let's Practice."]} />
  //     <Tabs
  //       filters={tabs.map((item) => item[1])}
  //       onChangeTab={(e) => setFilter(tabs[e.i][0])}
  //     />
  //   </>
  // );

  return (
    <Container>
      <PageHeading title={translation["Let's Practice."]} />
      <Tabs
        filters={tabs}
        // filters={tabs.map((item) => item[1])}
        // onChangeTab={(e) => setFilter(tabs[e.i][0])}
      />
      {/* <>
        {filter === 'Teachers' ? (
          <TeacherLoop scrollEnabled header={header} />
        ) : (
          <ContentLoop
            scrollEnabled
            header={header}
            filter={filter === 'All' ? undefined : filter}
          />
        )}
      </> */}
    </Container>
  );
};

export default LibraryScreen;
