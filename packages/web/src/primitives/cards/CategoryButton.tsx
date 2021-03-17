import React from 'react';
import { useHistory, useCurrentUser, useNavigation } from '../../hooks';
import Paragraph from '../typography/Paragraph';
import Icon from '../icons/Icon';
import Headline from '../typography/Headline';
import Card from './Card';
import CardBody from './CardBody';
import CardItem from './CardItem';
import { Category, Feature, IconTypes, slugify } from 'common';

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
  iconType,
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
    <Card
      style={{
        borderWidth: 0,
        // borderColor: color ? colorPairings[color].main : undefined,
      }}>
      <CardItem
        // style={{
        //   backgroundColor: color ? colorPairings[color].main : undefined,
        // }}
        onPress={handlePress}>
        <CardBody
          style={{
            flex: 2,
            justifyContent: 'space-around',
            padding: 15,
            paddingBottom: 15,
          }}>
          <Headline
            small
            style={{
              color: color ? color : 'textPrimary',
              paddingTop: 5,
            }}>
            {title}
          </Headline>
          {description && <Paragraph>{description}</Paragraph>}
        </CardBody>
        {/* <Right style={{ flex: 1, marginLeft: 10 }}>
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
        </Right> */}
      </CardItem>
    </Card>
  );
};

export default CategoryButton;
