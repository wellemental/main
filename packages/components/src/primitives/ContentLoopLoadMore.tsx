// NOT USING YET, MAY DELETE PENDING PROGRESS
import React, { useState } from 'react';
import { Platform } from 'react-native';
import { PlaysServiceType, PlayEvent, convertTimestamp } from 'services';
import {
  Button,
  ListEmpty,
  Tabs,
  Box,
  Headline,
  Spinner,
  ContentCardSmall,
  Paragraph,
} from '.';
import { List } from 'native-base';
import { MenuItem } from '../types';
import { useCurrentUser, useContent, useNavigation } from '../hooks';
import useLoadMore from '../hooks/useLoadMore';
import SettingsScreen from '../screens/SettingsScreen';

// type Props = {
//   homepage?: boolean;
//   short?: boolean;
//   type?: 'recent' | 'new' | 'favs';
// };

// Recently played
// Favs
// New

const ContentLoopLoadMore: React.FC = () => {
  const { translation } = useCurrentUser();
  const { loading, content, teachers } = useContent();
  const navigation = useNavigation();

  const items = Object.values(content).slice(0, 2);

  return loading || !content || !teachers ? (
    <Spinner />
  ) : (
    <>
      <List style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 5 }}>
        {items && items.length > 0 ? (
          items.slice(0, 2).map((item, idx: number) => {
            return (
              <ContentCardSmall
                key={idx}
                content={item}
                teacher={teachers[item.teacher]}
              />
            );
          })
        ) : (
          <ListEmpty>{translation['Error loading content']}</ListEmpty>
        )}
        <Button
          text={translation['See all']}
          transparent
          onPress={() => navigation.navigate('Library')}
        />
      </List>
    </>
  );
};

export default ContentLoopLoadMore;
