// NativeBase tabs with animation effect. Couldn't use in main library because lists were too long
import React, { useState } from 'react';
import Headline from './Headline';
import Paragraph from './Paragraph';
import Button from './Button';
import Box from './Box';
import RecentlyPlayedLoop from './RecentlyPlayedLoop';
import { Tabs, Tab, TabHeading, Icon, Text } from 'native-base';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';

const TabsNB: React.FC = () => {
  const tabs = ['History', 'New'];

  const [tab, setTab] = useState(tabs[0]);

  return (
    <>
      <Box row>
        {tabs.map((item, idx) => (
          <Button
            key={idx}
            text={item}
            style={{
              borderBottomColor:
                item === tab ? brandColors.brandPrimary : 'rgba(0,0,0,0)',
              borderBottomWidth: 3,
              borderRadius: 0,
            }}
            transparent
            onPress={() => setTab(item)}
          />
        ))}
      </Box>
      {tab === 'History' && <RecentlyPlayedLoop />}
    </>
  );
};

export default TabsNB;
