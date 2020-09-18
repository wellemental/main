import React, { ReactElement } from 'react';
import { Tabs as NBTabs, Tab, ScrollableTab, NativeBase } from 'native-base';
import { Tags } from 'services';

type Props = {
  filters: { [key: string]: ReactElement };
  // filters: string[];
};

const Tabs: React.FC<Props & NativeBase.Tabs> = ({ filters, ...props }) => {
  const tabTitles = Object.keys(filters);
  const tabContent = Object.values(filters);

  return (
    <NBTabs
      onChangeTab={(e) => console.log(e.ref)}
      s
      {...props}
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
          onChangeTab=
          heading={option}
          tabStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}>
          {tabContent[idx]}
        </Tab>
      ))}
    </NBTabs>
  );
};

export default Tabs;
