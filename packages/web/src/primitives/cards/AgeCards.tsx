import React from 'react';
import { useNavigation, useCurrentUser } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import Box from '../utils/Box';
import CardItem from './CardItem';
import Card from './Card';
import CardBody from './CardBody';
import { ageGroups as defaultAgeGroups } from '../../constants';
import { slugify } from 'common';

const AgeCards: React.FC = () => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();

  return (
    <Box row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {defaultAgeGroups.map(group => {
        return (
          <Card key={group.title} style={{ width: 'calc(50% - 10px)' }}>
            <CardItem
              onPress={() =>
                navigation.navigate(
                  `/category/${group.slug ? group.slug : slugify(group.title)}`,
                )
              }>
              <CardBody
                style={{
                  flex: 2,
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: 15,
                  paddingBottom: 15,
                }}>
                <Headline center>{group.title}</Headline>
                <Paragraph center>years</Paragraph>
              </CardBody>
            </CardItem>
          </Card>
        );
      })}
    </Box>
  );
};

export default AgeCards;
