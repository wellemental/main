import React, { useState } from 'react';
import { Container, ContentLoop, PageHeading, Tabs } from '../primitives';
import { Tags } from 'services';
import { useCurrentUser } from '../hooks';
import { MenuItem } from '../types';

const FavoritesScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const favorites =
    user &&
    user.favorites &&
    Object.keys(user.favorites).filter(
      (item: string) => user.favorites[item].favorited,
    );

  // const tabs: TabsType = {
  //   [translation.All]: <ContentLoop favorites={favorites} />,
  //   [translation.Move]: (
  //     <ContentLoop favorites={favorites} filter={Tags.Move} />
  //   ),
  //   [translation.Meditate]: (
  //     <ContentLoop favorites={favorites} filter={Tags.Meditate} />
  //   ),
  //   [translation.Learn]: (
  //     <ContentLoop favorites={favorites} filter={Tags.Learn} />
  //   ),
  //   [translation.Sleep]: (
  //     <ContentLoop favorites={favorites} filter={Tags.Sleep} />
  //   ),
  // };

  // const tabs: MenuItem[] = [
  //   { label: translation.All },
  //   { label: translation.Move, filter: Tags.Move },
  //   { label: translation.Meditate, filter: Tags.Meditate },
  //   { label: translation.Learn, filter: Tags.Learn },
  //   { label: translation.Sleep, filter: Tags.Sleep },
  // ];

  // const [tab, setTab] = useState(tabs[0]);

  return (
    <Container scrollEnabled>
      <PageHeading title={translation['Your Favorites']} />
      {/* <Tabs tabs={tabs} active={tab} setTab={setTab} /> */}
      <ContentLoop favorites={favorites} />
    </Container>
  );
};

export default FavoritesScreen;
