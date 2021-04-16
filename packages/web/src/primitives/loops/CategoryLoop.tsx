import React from 'react';
import { Subheadline } from '../typography';
import CategoryButton from '../cards/CategoryButton';
import { Category, MuiTypeColors, Redirect } from 'common';

const categoryColors = ['yellow', 'blurple', 'orange', 'teal'] as const;
export type CategoryColors = typeof categoryColors[number];

type Props = {
  categories?: Category[];
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

  return (
    <>
      {!hideTitle && (
        <Subheadline color={color}>{title ? title : 'Categories'}</Subheadline>
      )}

      {categories &&
        categories.map((category, idx) => (
          <CategoryButton
            key={category.title}
            title={category.title}
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
