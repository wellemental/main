import React from 'react';
import { Card, CardItem, Right, Body, Icon } from 'native-base';
import Image from './Image';
import { useNavigation, useCurrentUser } from '../hooks';
import Paragraph from './Paragraph';
import Headline from './Headline';
import {
  Category,
  Feature,
  Languages,
  isFeature,
  ColorPairings,
  colorPairings,
} from 'common';

type Props = {
  category: Category | Feature;
  color: ColorPairings;
};

const CategoryCard: React.FC<Props> = ({ category, color }) => {
  const navigation = useNavigation();
  const { translation, user } = useCurrentUser();

  // If it's a feature, get the translation from the features object
  // Then if translation is possible - age groups have them, features don't currently
  const title: string =
    isFeature(category) && user.language === Languages.Es
      ? category['title-es']
      : translation[category.title]
      ? translation[category.title]
      : category.title;

  const description: string =
    isFeature(category) && user.language === Languages.Es
      ? category['description-es']
      : translation[category.description]
      ? translation[category.description]
      : category.description;

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
            style={{ color: color ? colorPairings[color].text : undefined }}>
            {title}
          </Headline>
          {description && <Paragraph>{description}</Paragraph>}
        </Body>
        <Right style={{ flex: 1, marginLeft: 10 }}>
          {category.image && (
            <Image
              source={
                typeof category.image === 'string'
                  ? {
                      uri: category.image,
                    }
                  : category.image
              }
              style={{
                height: 120,
                width: 120,
                borderRadius: 20,
              }}
            />
          )}
          {category.icon && (
            <Icon
              name={category.icon}
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
