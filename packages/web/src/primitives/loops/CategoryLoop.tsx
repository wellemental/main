import React from 'react';
import { Subheadline } from '../typography';
import CategoryButton from '../cards/CategoryButton';
import {
  Category,
  MuiTypeColors,
  Redirect,
  Languages,
  Feature,
  isFeature,
} from 'common';
import { useCurrentUser } from '../../hooks';

const categoryColors = ['yellow', 'blurple', 'orange', 'teal'] as const;
export type CategoryColors = typeof categoryColors[number];

type Props = {
  categories?: Category[] | Feature[];
  title?: string;
  hideTitle?: boolean;
  redirects?: Redirect[];
  colors?: CategoryColors[];
  color?: MuiTypeColors | 'white';
};

const CategoryLoop: React.FC<Props> = ({
  categories,
  title,
  hideTitle,
  redirects,
  colors,
  color,
}) => {
  const theColors = colors ? colors : categoryColors;
  const { language } = useCurrentUser();
  const isSpanish = language === Languages.Es;

  const isAFeature = categories ? isFeature(categories[0]) : false;

  return (
    <>
      {!hideTitle && (
        <Subheadline color={color}>{title ? title : 'Categories'}</Subheadline>
      )}

      {categories &&
        // @ts-ignore
        categories.map((category: Category | Feature, idx: number) => (
          <CategoryButton
            key={category.title}
            title={
              // Covers for homepage remote config feature buttons
              // @ts-ignore - Need to improve Typescript/Props to differentiate between features and categories
              category['title-es'] && isSpanish
                ? // @ts-ignore
                  category['title-es']
                : category.title
            }
            color={theColors[idx]}
            category={category}
            icon={category.tag}
            iconType={
              category.icon === 'fist-raised'
                ? 'FontAwesome5'
                : category.iconType
            }
          />
        ))}

      {redirects &&
        redirects.map((redirect, idx) => (
          <CategoryButton
            key={redirect.title}
            title={redirect.title}
            color={theColors[idx]}
            redirect={redirect.slug}
            icon={redirect.icon}
            iconType={redirect.iconType}
          />
        ))}
    </>
  );
};

export default CategoryLoop;
