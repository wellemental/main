import React from 'react';
import { Button, ListEmpty, Loading, ContentCardSmall, Box } from '.';
import { List } from 'native-base';
import { useCurrentUser, useContent, useNavigation } from '../hooks';
import { Colors } from 'packages/common';

type Props = {
  color: Colors;
};

const ContentLoopSmall: React.FC<Props> = ({ color }) => {
  const { translation } = useCurrentUser();
  const { loading, content } = useContent();
  const navigation = useNavigation();

  const items = Object.values(content).slice(0, 2);

  return (
    <Loading loading={loading || !content} fullPage={false}>
      <List>
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
            style={{
              backgroundColor: 'rgba(0,0,0,0',
            }}
            transparent={color === 'white' ? false : true}
            onPress={() => navigation.navigate('Library')}
          />
        </Box>
      </List>
    </Loading>
  );
};

export default ContentLoopSmall;
