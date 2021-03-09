import React from 'react';
import { useHistory, useCurrentUser } from '../hooks';
import Paragraph from './Paragraph';
import { Category, Languages, Feature } from 'common';
import {
  Card,
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import CardTitle from './CardTitle';
import { slugify, isFeature } from '../services/helpers';

type Props = {
  category: Category | Feature;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
  const history = useHistory();
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
      : !!category.description && translation[category.description]
      ? translation[category.description]
      : category.description;

  return (
    <Card
      style={{
        padding: '0px',
        borderRadius: '20px',
        marginBottom: '15px',
      }}>
      <CardActionArea
        onClick={() =>
          history.push(
            `/category/${
              category.slug ? category.slug : slugify(category.title)
            }`,
          )
        }>
        <Box display="flex" flexDirection="row">
          <CardContent style={{ flex: 1, padding: '20px 20px 5px' }}>
            <CardTitle text={title} />

            {description && <Paragraph small>{description}</Paragraph>}
          </CardContent>

          <CardMedia
            component="img"
            alt={category.title}
            height="125px"
            image={category.image}
            title={category.title}
            style={{ width: '125px', borderRadius: '20px' }}
          />
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
