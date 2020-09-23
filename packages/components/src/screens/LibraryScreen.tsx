import React, { useState } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import {
  Tabs,
  Container,
  ContentLoop,
  Paragraph,
  PageHeading,
  TeacherLoop,
} from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';
import { LibraryScreenRouteProp, MenuItem } from '../types';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  route: LibraryScreenRouteProp;
};
const LibraryScreen: React.FC = () => {
  const { translation } = useCurrentUser();

  // const tabs = {
  //   [translation.All]: <ContentLoop key="All" />,
  //   [translation.Move]: <ContentLoop key="Move" filter={Tags.Move} />,
  //   [translation.Meditate]: (
  //     <ContentLoop key="Meditate" filter={Tags.Meditate} />
  //   ),
  //   [translation.Learn]: <ContentLoop key="Learn" filter={Tags.Learn} />,
  //   [translation.Sleep]: <ContentLoop key="Sleep" filter={Tags.Sleep} />,
  //   [translation.Teachers]: <TeacherLoop key="Teachers" />,
  // };

  const tabs: MenuItem[] = [
    { label: translation.All, filter: 'All' },
    { label: translation.Move, filter: Tags.Move },
    { label: translation.Meditate, filter: Tags.Meditate },
    { label: translation.Learn, filter: Tags.Learn },
    { label: translation.Sleep, filter: Tags.Sleep },
    { label: translation.Teachers },
  ];

  const [tab, setTab] = useState(tabs[0]);

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
    <Container scrollEnabled>
      <PageHeading title={translation["Let's Practice."]} />

      <Tabs tabs={tabs} active={tab} setTab={setTab} />

      {tab.label === 'Teachers' ? (
        <TeacherLoop scrollEnabled />
      ) : (
        <ContentLoop filter={tab.filter === 'All' ? undefined : tab.filter} />
      )}

      {/* {filter === 'Teachers' ? (
          <TeacherLoop scrollEnabled header={header} />
        ) : (
          <ContentLoop
            scrollEnabled
            header={header}
            filter={filter === 'All' ? undefined : filter}
          />
        )} */}
      {/* </> */}
    </Container>
  );
};

export default LibraryScreen;
