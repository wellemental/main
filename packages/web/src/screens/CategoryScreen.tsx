import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch, useCurrentUser } from '../hooks';
import { Category } from '../types';
import { slugify } from '../services/helpers';
import { ageGroups } from '../constants';

const CategoryScreen: React.FC = () => {
  const { features } = useContent();
  const { translation } = useCurrentUser();

  // Get category slug from URL
  const match = useRouteMatch();
  let category: Category | null = null;

  // Try to match with an age group slug
  category = ageGroups.filter((group) => group.slug === match)[0];

  // Match the category slug to the category from remote config
  // Only if it already isn't matching with an age group category
  if (!category && features) {
    category = features.categories.filter(
      (category) => slugify(category.title) === match,
    )[0];
  }

  return !category ? (
    <Spinner />
  ) : (
    <>
      <PageHeading
        title={
          translation[category.title]
            ? translation[category.title]
            : category.title
        } // translation[category.title]}
        subtitle={
          translation[category.description]
            ? translation[category.description]
            : category.description
        }
      />
      {/* @ts-ignore */}
      <ContentLoop filter={category.tag} />
    </>
  );
};

export default CategoryScreen;
