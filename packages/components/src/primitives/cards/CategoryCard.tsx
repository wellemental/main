import React from 'react';
import { Card, CardItem, Right, Body, Icon } from 'native-base';
import { useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Headline from '../typography/Headline';
import { Category, Feature, ColorPairings, colorPairings } from 'common';
import variables from '../../assets/native-base-theme/variables/wellemental';

type Props = {
  category: Category | Feature;
  color?: ColorPairings;
};

const CategoryCard: React.FC<Props> = ({ category, color }) => {
  const navigation = useNavigation();

  const title: string = category.title;
  const description: string | undefined = category.description;

  return (
    <Card>
      <CardItem
        cardBody
        button
        style={{
          backgroundColor: color ? colorPairings[color].main : undefined,
        }}
        onPress={() => navigation.navigate('Category', { category: category })}>
        <Body
          style={{
            flex: 2,
            justifyContent: 'space-around',
            padding: 15,
            paddingBottom: 15,
          }}>
          <Headline
            small
            style={{
              color: color ? colorPairings[color].text : variables.brandPrimary,
            }}>
            {title}
          </Headline>
          {description && <Paragraph>{description}</Paragraph>}
        </Body>
        <Right style={{ flex: 1, marginLeft: 10 }}>
          {category.icon && (
            <Icon
              name={category.icon}
              type={category.iconType ? category.iconType : undefined}
              style={{
                fontSize: 50,
                color: color ? colorPairings[color].light : undefined,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
            />
          )}
        </Right>
      </CardItem>
    </Card>
  );
};

export default CategoryCard;
