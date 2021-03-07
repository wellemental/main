// NativeBase tabs with animation effect. Couldn't use in main library because lists were too long
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Button from './Button';
import NewContentLoop from './NewContentLoop';
import Box from './Box';
import RecentlyPlayedLoop from './RecentlyPlayedLoop';
import { brandColors } from '../assets/native-base-theme/variables/wellemental';
import {
  useLoadMore,
  useContainer,
  useContent,
  useCurrentUser,
} from '../hooks';
import { PlaysServiceType } from 'services';

const TabsNB: React.FC = () => {
  const tabs = ['History', 'New'];

  const [tab, setTab] = useState(tabs[0]);

  const { translation } = useCurrentUser();
  const { content, teachers } = useContent();

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
      <Box row pt={3}>
        {tabs.map((item, idx) => (
          <Button
            key={idx}
            text={item}
            style={{
              borderBottomColor:
                item === tab ? brandColors.brandPrimary : 'rgba(0,0,0,0)',
              borderBottomWidth: 3,
              borderRadius: 0,
              height: 40,
            }}
            transparent
            onPress={() => setTab(item)}
          />
        ))}
      </Box>
      {tab === 'History' && (
        <RecentlyPlayedLoop
          homepage
          loading={loading}
          content={content}
          teachers={teachers}
          loadingMore={loadingMore}
          loadMore={loadMore}
          items={items}
          hasMore={hasMore}
        />
      )}
      {tab === 'New' && <NewContentLoop />}
    </>
  );
};

export default TabsNB;
