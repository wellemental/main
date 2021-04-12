import React, { useState } from 'react';
import { Box, Tabs as MtTabs, Tab } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { colors, theme } from 'common';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

type Props = {
  centered?: boolean;
  tabs: { [key: string]: JSX.Element };
  transparent?: boolean;
  color?: 'white' | undefined;
  value?: number;
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

const Tabs: React.FC<Props> = ({
  tabs,
  centered,
  transparent,
  color,
  value,
}) => {
  // Tabs
  const [tab, setTab] = useState(value ? value : 0);
  const handleTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue);
  };

  console.log('TAB COLOR!!!!', color);
  return (
    <>
      <AppBar
        position="static"
        elevation={transparent ? 0 : 1}
        style={{
          marginBottom: '16px',
          backgroundColor: transparent ? 'rgba(0,0,0,0)' : 'white',
          borderRadius: theme.borderRadiusBase,
          padding: transparent ? 0 : '0 7px',
        }}>
        <MtTabs
          value={tab}
          onChange={handleTab}
          aria-label="Team tabs"
          style={{ color: color === 'white' ? 'white' : colors.primary }}
          indicatorColor={color === 'white' ? 'secondary' : 'primary'}
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
