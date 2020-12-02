import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch } from '../hooks';
import { Category } from '../types';
import { slugify } from '../services/helpers';

const CategoryScreen: React.FC = () => {
  const { features } = useContent();

  // Get category slug from URL
  const match = useRouteMatch();
  let category: Category | null = null;

  // Match the category slug to the category from remote config
  if (features) {
    category = features.categories.filter(
      (category) => slugify(category.title) === match,
    )[0];
  }

  return !category ? (
    <Spinner />
  ) : (
    <>
      <PageHeading
        title={category.title} // translation[category.title]}
        subtitle={
          category.description // ? translation[category.description] : undefined
        }
      />
      {/* @ts-ignore */}
      <ContentLoop filter={category.tag} />
    </>
  );
};

export default CategoryScreen;
