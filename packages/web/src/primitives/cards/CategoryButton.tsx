import React from 'react';
import { useHistory, useCurrentUser, useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Icon from '../icons/Icon';
import Headline from '../typography/Headline';
import Card from './Card';
import CardBody from './CardBody';
import Box from '../utils/Box';
import CardItem from './CardItem';
import { Category, Feature, IconTypes, slugify, colorPairings } from 'common';

type Props = {
  color?: 'yellow' | 'blurple' | 'orange' | 'teal';
  icon?: string;
  iconType?: IconTypes;
  title: string;
  description?: string;
  category?: Category | Feature;
  redirect?: string;
};

const CategoryButton: React.FC<Props> = ({
  title,
  icon,
  description,
  color,
  redirect,
  category,
}) => {
  const navigation = useNavigation();

  const handlePress = category
    ? () =>
        navigation.navigate(
          `/category/${
            category.slug ? category.slug : slugify(category.title)
          }`,
        )
    : redirect
    ? () => navigation.navigate(redirect)
    : undefined;

  return (
    <Card>
      <CardItem
        style={{
          backgroundColor: color ? colorPairings[color].main : 'white',
        }}
        onPress={handlePress}>
        <CardBody>
          <Box row justifyContent="space-between" alignItems="center">
            <Box>
              <Headline
                small
                style={{
                  color: color ? colorPairings[color].text : 'textPrimary',
                  // paddingTop: 5,
                }}>
                {title}
              </Headline>
              {description && <Paragraph>{description}</Paragraph>}
            </Box>
            <Box>
              {icon && (
                <Icon
                  name={icon}
                  // type={iconType}
                  style={{
                    fontSize: 50,
                    color: color ? colorPairings[color].light : undefined,
                    // paddingHorizontal: 20,
                    // paddingVertical: 10,
                  }}
                />
              )}
            </Box>
          </Box>
        </CardBody>
      </CardItem>
    </Card>
  );
};

export default CategoryButton;
