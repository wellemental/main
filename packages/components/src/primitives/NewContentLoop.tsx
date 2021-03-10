// NOT USING YET, MAY DELETE PENDING PROGRESS
import React from 'react';
import { Platform } from 'react-native';
import { Button, ListEmpty, Loading, ContentCardSmall, Box } from '.';
import { List } from 'native-base';
import { useCurrentUser, useContent, useNavigation } from '../hooks';

const ContentLoopSmall: React.FC = () => {
  const { translation } = useCurrentUser();
  const { loading, content } = useContent();
  const navigation = useNavigation();

  const items = Object.values(content).slice(0, 2);

  return (
    <Loading loading={loading || !content} fullPage={false}>
      <List style={{ marginHorizontal: Platform.OS === 'android' ? 0 : 5 }}>
        {items && items.length > 0 ? (
          items.slice(0, 2).map((item, idx: number) => {
            return <ContentCardSmall key={idx} content={item} />;
          })
        ) : (
          <ListEmpty>{translation['Error loading content']}</ListEmpty>
        )}
        <Box mt={1}>
          <Button
            small
            text={translation['See all']}
            transparent
            onPress={() => navigation.navigate('Library')}
          />
        </Box>
      </List>
    </Loading>
  );
};

export default ContentLoopSmall;
