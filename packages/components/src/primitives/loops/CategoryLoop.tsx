import React from 'react';
import { Subheadline, CategoryButton } from '..';
import { Category, Redirect, Colors, Languages, Feature } from 'common';
import { useCurrentUser } from '../../hooks';

const categoryColors = ['yellow', 'blurple', 'orange', 'teal'] as const;
export type CategoryColors = typeof categoryColors[number];

type Props = {
  categories?: Category[] | Feature[];
  title?: string;
  hideTitle?: boolean;
  redirects?: Redirect[];
  colors?: CategoryColors[];
  color?: Colors | 'white';
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

  return (
    <>
      {!hideTitle && (
        <Subheadline color={color}>{title ? title : 'Categories'}</Subheadline>
      )}

      {categories &&
        categories.map((category: Category | Feature, idx: number) => (
          <CategoryButton
            key={category.title}
            title={
              // Covers for homepage remote config feature buttons
              category['title-es'] && isSpanish
                ? category['title-es']
                : category.title
            }
            color={theColors[idx]}
            category={category}
            icon={category.icon}
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
            title={
              // Covers for homepage remote config feature buttons
              redirect['title-es'] && isSpanish
                ? redirect['title-es']
                : redirect.title
            }
            color={theColors[idx]}
            redirect={redirect.page}
            icon={redirect.icon}
            iconType={redirect.iconType}
          />
        ))}
    </>
  );
};

export default CategoryLoop;
