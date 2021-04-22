// Tabs on Homepage
import React, { useState } from 'react';
import ContentLoop from '../loops/ContentLoop';
import Box from '../utils/Box';
import TabsButtons from './TabsButtons';
import ContentLoopLoadMore from '../loops/ContentLoopLoadMore';
import { Colors, Tab } from 'common';

type Props = {
  color?: Colors;
};

const HomepageTabs: React.FC<Props> = ({ color }) => {
  const tabs: Tab[] = [{ label: 'History' }, { label: 'New' }];

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
      {tab === 'New' && <ContentLoop small limit={2} seeAll color={color} />}
    </>
  );
};

export default HomepageTabs;
