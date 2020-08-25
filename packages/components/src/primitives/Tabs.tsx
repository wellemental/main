import React, { ReactElement } from 'react';
import { Tabs as NBTabs, Tab, ScrollableTab } from 'native-base';
import { Tags } from 'services';

type Props = {
  filters: { [key: string]: ReactElement };
};

const Tabs: React.FC<Props> = ({ filters }) => {
  const tabTitles = Object.keys(filters);
  const tabContent = Object.values(filters);

  return (
    <NBTabs
      renderTabBar={() => (
        <ScrollableTab
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            borderBottomWidth: 0,
            marginBottom: 15,
          }}
        />
      )}>
      {tabTitles.map((option: Tags | 'All', idx: number) => (
        <Tab
          key={idx}
          heading={option}
          tabStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          {tabContent[idx]}
        </Tab>
      ))}
    </NBTabs>
  );
};

export default Tabs;
