import React from 'react';
import { Subheadline, CategoryButton } from '.';
import { useCurrentUser } from '../hooks';
import { Category, Redirect } from 'common';

const categoryColors = ['yellow', 'blurple', 'orange', 'teal'] as const;
export type CategoryColors = typeof categoryColors[number];

type Props = {
  categories?: Category[];
  title?: string;
  hideTitle?: boolean;
  redirects?: Redirect[];
  colors?: CategoryColors[];
};

const CategoryLoop: React.FC<Props> = ({
  categories,
  title,
  hideTitle,
  redirects,
  colors,
}) => {
  const { translation } = useCurrentUser();

  const theColors = colors ? colors : categoryColors;

  return (
    <>
      {!hideTitle && (
        <Subheadline>
          {title && translation[title]
            ? translation[title]
            : translation.Categories}
        </Subheadline>
      )}

      {categories &&
        categories.map((category, idx) => (
          <CategoryButton
            key={category.title}
            title={category.title}
            color={theColors[idx]}
            category={category}
            icon={category.icon}
            iconType={category.iconType}
          />
        ))}

      {redirects &&
        redirects.map((redirect, idx) => (
          <CategoryButton
            key={redirect.title}
            title={redirect.title}
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
