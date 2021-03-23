import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch, useCurrentUser } from '../hooks';
import { Category, categories, Tags } from 'common';
import { slugify } from '../services/helpers';
import { ageGroups } from '../constants';

const CategoryScreen: React.FC = () => {
  const { features } = useContent();

  // Get category slug from URL
  const match = useRouteMatch();
  let category: Category | null = null;

  // Try to match with an age group slug
  category = ageGroups.filter(group => group.slug === match)[0];

  console.log('MATCH - ', match);
  console.log('CATEGORY #1 - ', category);

  // Match the category slug to the category from remote config
  // Only if it already isn't matching with an age group category
  if (!category && features) {
    category = features.categories.filter(
      category => slugify(category.title) === match,
    )[0];
  }

  if (!category) {
    category = Object.values(categories).filter(category => {
      if (category.tag === Tags.Stress && match === 'anxiety-and-stress') {
        return true;
      }

      if (category.tag === Tags.Philosophy && match === 'yoga-philosophy') {
        return true;
      }

      if (
        category.tag === Tags['Yoga Classes'] &&
        match === 'full-length-yoga-classes'
      ) {
        return true;
      }

      return category.tag === match;
    })[0];
  }

  return !category ? (
    <Spinner />
  ) : (
    <>
      <PageHeading title={category.title} subtitle={category.description} />
      {/* @ts-ignore */}
      <ContentLoop filter={category.tag} />
    </>
  );
};

export default CategoryScreen;
