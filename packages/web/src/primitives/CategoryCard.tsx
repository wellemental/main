import React from 'react';
import { useHistory, useCurrentUser } from '../hooks';
import Paragraph from './Paragraph';
import { Category } from '../types';
import {
  Card,
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@material-ui/core';
import { slugify } from '../services/helpers';

type Props = {
  category: Category;
};

const CategoryCard: React.FC<Props> = ({ category }) => {
  const history = useHistory();
  const { translation } = useCurrentUser();

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
            <Paragraph variant="subtitle2" noWrap>
              {/* Translate if possible - age groups have them, features don't currently */}
              {translation[category.title]
                ? translation[category.title]
                : category.title}
            </Paragraph>

            {category.description && (
              <Paragraph small>
                {translation[category.description]
                  ? translation[category.description]
                  : category.description}
              </Paragraph>
            )}
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
