// Tabs on Homepage
import React, { useState } from 'react';
// import NewContentLoop from '../loops/NewContentLoop';
import Box from '../utils/Box';
import Button from '../buttons/Button';
import Tabs from '../buttons/Tabs';
import ContentLoopLoadMore from '../loops/ContentLoopLoadMore';
import ContentLoop from '../loops/ContentLoop';
import {
  useLoadMore,
  useContainer,
  useNavigation,
  useCurrentUser,
} from '../../hooks';
import { PlaysServiceType } from 'services';
import { Colors, Tab } from 'common';

type Props = {
  color?: 'white' | undefined;
};

const TabsNB: React.FC<Props> = ({ color }) => {
  const { translation } = useCurrentUser();
  const navigation = useNavigation();

  const container = useContainer();
  const service = container.getInstance<PlaysServiceType>('playsService');

  const {
    items,
    loading,
    loadMore,
    loadingMore,
    hasMore,
    // @ts-ignore
  } = useLoadMore(service.query, { limit: 2 });

  const tabs: { [key: string]: JSX.Element } = {
    [translation.History]: (
      <>
        <ContentLoopLoadMore
          recentlyPlayed
          loading={loading}
          items={items}
          hasMore={hasMore}
          loadingMore={loadingMore}
          loadMore={loadMore}
        />
        <Box mt={-1}>
          <Button
            size="small"
            fullWidth={true}
            text={translation['See all']}
            disableElevation={color === 'white'}
            style={{
              backgroundColor: 'rgba(0,0,0,0)',
            }}
            variant={color === 'white' ? 'contained' : 'text'}
            onPress={() =>
              navigation.navigate('Profile', {
                defaultTab: 'History',
              })
            }
          />
        </Box>
      </>
    ),
    [translation.New]: (
      <>
        <ContentLoop small limit={2} noLoadMore />
        <Button
          size="small"
          fullWidth={true}
          text={translation['See all']}
          disableElevation={color === 'white'}
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
          }}
          variant={color === 'white' ? 'contained' : 'text'}
          onPress={() =>
            navigation.navigate('Category', {
              category: { title: 'New', tag: undefined },
            })
          }
        />
      </>
    ),
  };

  return (
    <Box mt={5}>
      <Tabs transparent tabs={tabs} color={color} />
    </Box>
  );
};

export default TabsNB;
