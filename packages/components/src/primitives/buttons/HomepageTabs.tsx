// Tabs on Homepage
import React, { useState } from 'react';
import ContentLoop from '../loops/ContentLoop';
import Button from './Button';
import Box from '../utils/Box';
import TabsButtons from './TabsButtons';
import ContentLoopLoadMore from '../loops/ContentLoopLoadMore';
import {
  useLoadMore,
  useContainer,
  useContent,
  useCurrentUser,
  useNavigation,
} from '../../hooks';
import { PlaysServiceType } from 'services';
import { Colors, Tab } from 'common';

type Props = {
  color?: Colors;
};

const HomepageTabs: React.FC<Props> = ({ color }) => {
  const { translation } = useCurrentUser();
  const tabs: Tab[] = [{ label: 'History' }, { label: 'New' }];
  const navigation = useNavigation();

  const [tab, setTab] = useState(tabs[0].label);

  return (
    <>
      <Box row pt={5} pb={1}>
        <TabsButtons
          color={color}
          tabs={tabs}
          setState={setTab}
          active={tab}
          small
        />
      </Box>
      {tab === 'History' && (
        <ContentLoopLoadMore type="history" homepage color={color} />
      )}
      {tab === 'New' && (
        <>
          <ContentLoop small limit={2} seeAll color={color} />
          <Button
            small
            full
            text="See all"
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            transparent={color !== 'white'}
            onPress={() =>
              navigation.navigate('Category', {
                category: { title: 'New', tag: undefined },
              })
            }
          />
        </>
      )}
    </>
  );
};

export default HomepageTabs;
