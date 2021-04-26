import React from 'react';
import { useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import { Card, CardItem, CardBody } from './';
import Box from '../utils/Box';
import { Category, Feature } from 'common';
import { CardMedia } from '@material-ui/core';
import CardTitle from './CardTitle';
import { slugify } from 'common';

type Props = {
  category: Category | Feature;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
  const navigation = useNavigation();

  // If it's a feature, get the translation from the features object
  // Then if translation is possible - age groups have them, features don't currently
  const title: string = category.title;
  const description: string | undefined = category.description;

  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardItem
        onPress={() =>
          navigation.navigate(
            `/category/${
              category.slug ? category.slug : slugify(category.title)
            }`,
          )
        }>
        <Box display="flex" flexDirection="row">
          <CardBody style={{ flex: 1, padding: '20px 20px 5px' }}>
            <CardTitle text={title} />

            {description && <Paragraph small>{description}</Paragraph>}
          </CardBody>

          <CardMedia
            component="img"
            alt={category.title}
            height="125px"
            image={category.image}
            title={category.title}
            style={{ width: '125px', borderRadius: '20px' }}
          />
        </Box>
      </CardItem>
    </Card>
  );
};

export default CategoryCard;
