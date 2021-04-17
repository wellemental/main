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
import { PlaysServiceType } from 'common';

type Props = {
  color?: 'white' | undefined;
};

const TabsNB: React.FC<Props> = ({ color }) => {
  const { translation } = useCurrentUser();

  const tabs: { [key: string]: JSX.Element } = {
    [translation.History]: (
      <ContentLoopLoadMore type="history" homepage color={color} />
    ),
    [translation.New]: <ContentLoop small limit={2} seeAll color={color} />,
  };

  return (
    <Box mt={5}>
      <Tabs transparent tabs={tabs} color={color} />
    </Box>
  );
};

export default TabsNB;
