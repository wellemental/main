import React, { useState } from 'react';
import { Box, Tabs as MtTabs, Tab } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { theme } from 'common';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

type Props = {
  centered?: boolean;
  tabs: { [key: string]: JSX.Element };
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <span
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </span>
  );
};

const a11yProps = (index: any) => {
  return {
    id: `scrollable-tab-${index}`,
    'aria-controls': `scrollable-tabpanel-${index}`,
  };
};

const Tabs: React.FC<Props> = ({ tabs, centered }) => {
  // Tabs
  const [tab, setTab] = useState(0);
  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={1}
        style={{
          marginBottom: '16px',
          backgroundColor: 'white',
          borderRadius: theme.borderRadiusBase,
          padding: '0 7px',
        }}>
        <MtTabs
          value={tab}
          onChange={handleTab}
          aria-label="Team tabs"
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          // scrollButtons="off"
          scrollButtons="auto"
          centered={!centered ? false : false}>
          {Object.keys(tabs).map((key: string, idx: number) => (
            <Tab
              key={key}
              label={key}
              {...a11yProps(idx)}
              style={{ minWidth: '100px' }}
            />
          ))}
        </MtTabs>
      </AppBar>
      {Object.values(tabs).map((value: any, idx: number) => (
        <TabPanel key={idx} value={tab} index={idx}>
          {value}
        </TabPanel>
      ))}
    </>
  );
};

export default Tabs;

// import React from 'react';
// import Paragraph from './Paragraph';
// import { MenuItem } from 'common';

// type Props = {
//   tabs: MenuItem[];
//   active: MenuItem;
//   setTab: React.Dispatch<MenuItem>;
//   // filters: string[];
// };

// const Tabs: React.FC<Props> = ({ tabs, active, setTab }) => {
//   return (
//     <FlatList
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       data={tabs}
//       keyExtractor={(item) => item.label}
//       renderItem={({ item, index }) => (
//         <TouchableOpacity
//           style={{
//             marginLeft: index === 0 ? 15 : 0,
//             marginBottom: 15,
//             paddingHorizontal: 15,
//             minWidth: 50,
//             borderBottomColor:
//               active.label === item.label
//                 ? variables.brandPrimary
//                 : 'rgba(0,0,0,0)',
//             borderBottomWidth: 4,
//             height: 40,
//             justifyContent: 'center',
//             alignContent: 'center',
//           }}
//           onPress={() => setTab(item)}
//           key={item.label}>
//           <Paragraph
//             style={{
//               fontSize: 20,
//               fontFamily: 'Inter',
//               marginLeft: 7,
//               marginRight: 7,
//               fontWeight: active.label === item.label ? '600' : '400',
//               color:
//                 active.label === item.label
//                   ? variables.brandPrimary
//                   : variables.lightTextColor,
//             }}
//             key={item.label}>
//             {item.label}
//           </Paragraph>
//         </TouchableOpacity>
//       )}
//     />
//   );
// };

// export default Tabs;
