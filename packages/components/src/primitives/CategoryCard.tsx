import React from 'react';
import { Card, CardItem, Right, Body, H3 } from 'native-base';
import Image from './Image';
import { useNavigation, useCurrentUser } from '../hooks';
import Paragraph from './Paragraph';
import { Category, Feature, Languages, isFeature } from 'services';

type Props = {
  category: Category | Feature;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
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
        onPress={() => navigation.navigate('Category', { category: category })}>
        <Body
          style={{
            flex: 2,
            justifyContent: 'space-around',
            padding: 15,
            paddingBottom: 15,
          }}>
          <H3>{title}</H3>
          {description && <Paragraph small>{description}</Paragraph>}
        </Body>
        <Right style={{ flex: 1, marginLeft: 10 }}>
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
        </Right>
      </CardItem>
    </Card>
  );
};

export default CategoryCard;
