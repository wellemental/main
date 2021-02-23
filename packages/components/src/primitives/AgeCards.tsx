import React from 'react';
import { Card, CardItem, Body } from 'native-base';
import { useNavigation, useCurrentUser } from '../hooks';
import Paragraph from './Paragraph';
import Headline from './Headline';
import Box from './Box';
import { defaultAgeGroups } from '../constants';
import { deviceWidth } from 'services';
import variables from '../assets/native-base-theme/variables/wellemental';

const AgeCards: React.FC = () => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();

  return (
    <Box row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {defaultAgeGroups.map((group) => {
        return (
          <Card
            key={group.title}
            style={{
              width:
                deviceWidth / 2 - variables.mainContentPaddingHorizontal - 10,
            }}>
            <CardItem
              cardBody
              button
              onPress={() =>
                navigation.navigate('Category', { category: group })
              }>
              <Body
                style={{
                  flex: 2,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: 15,
                  paddingBottom: 15,
                }}>
                <Headline center>{group.title}</Headline>
                <Paragraph>{translation.years}</Paragraph>
              </Body>
            </CardItem>
          </Card>
        );
      })}
    </Box>
  );
};

export default AgeCards;
