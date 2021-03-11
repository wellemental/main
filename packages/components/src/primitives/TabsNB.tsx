// NativeBase tabs with animation effect. Couldn't use in main library because lists were too long
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Button from './Button';
import NewContentLoop from './NewContentLoop';
import Box from './Box';
import TabsButtons from './TabsButtons';
import RecentlyPlayedLoop from './RecentlyPlayedLoop';
import { useLoadMore, useContainer, useContent } from '../hooks';
import { PlaysServiceType } from 'services';
import { Tabs, Colors } from 'common';

type Props = {
  color?: Colors;
};

const TabsNB: React.FC<Props> = ({ color }) => {
  const tabs: Tabs[] = [{ label: 'History' }, { label: 'New' }];

  const [tab, setTab] = useState(tabs[0].label);

  const { content } = useContent();

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
  } = useLoadMore(service.query, { limit: 2 });

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
        <RecentlyPlayedLoop
          homepage
          loading={loading}
          content={content}
          loadingMore={loadingMore}
          loadMore={loadMore}
          items={items}
          hasMore={hasMore}
          color={color}
        />
      )}
      {tab === 'New' && <NewContentLoop color={color} />}
    </>
  );
};

export default TabsNB;
