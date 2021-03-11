import React from 'react';
import { Card, CardItem, Right, Body } from 'native-base';
import { useNavigation } from '../hooks';
import Paragraph from './Paragraph';
import Icon from './Icon';
import Headline from './Headline';
import {
  Category,
  Feature,
  ColorPairings,
  colorPairings,
  IconTypes,
} from 'common';
import variables from '../assets/native-base-theme/variables/wellemental';

type Props = {
  color?: ColorPairings;
  icon: string;
  iconType?: IconTypes;
  title: string;
  description?: string;
  category?: Category | Feature;
  redirect?: string;
};

const CategoryButton: React.FC<Props> = ({
  title,
  icon,
  iconType,
  description,
  color,
  redirect,
  category,
}) => {
  const navigation = useNavigation();

  const handlePress = category
    ? () => navigation.navigate('Category', { category: category })
    : redirect
    ? () => navigation.navigate(redirect)
    : undefined;

  return (
    <Card>
      <CardItem
        cardBody
        button
        style={{
          backgroundColor: color ? colorPairings[color].main : undefined,
        }}
        onPress={handlePress}>
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
              paddingTop: 5,
            }}>
            {title}
          </Headline>
          {description && <Paragraph>{description}</Paragraph>}
        </Body>
        <Right style={{ flex: 1, marginLeft: 10 }}>
          {icon && (
            <Icon
              name={icon}
              type={iconType}
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

export default CategoryButton;
