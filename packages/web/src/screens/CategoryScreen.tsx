import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch, useCurrentUser } from '../hooks';
import { Category, categories, Tags } from 'common';
import { slugify } from '../services/helpers';
import { ageGroups } from '../constants';

// This filter and matching is horrible and needs to be cleaned up eventually.
const CategoryScreen: React.FC = () => {
  const { features } = useContent();

  // Get category slug from URL
  const match = useRouteMatch();
  let category: Category | null = null;

  // Unfiltered New category
  if (match === 'new') {
    category = {
      tag: undefined,
      title: 'New',
    };
  }

  // Try to match with an age group slug
  if (!category) {
    category = ageGroups.filter(group => group.slug === match)[0];
  }

  // Match the category slug to the category from remote config
  // Only if it already isn't matching with an age group category
  if (!category && features) {
    category = features.categories.filter(
      category => slugify(category.title) === match,
    )[0];
  }

  // If not ageGroup or feature, match here
  if (!category) {
    category = Object.values(categories).filter(category => {
      // Match tags that are different than their slugify
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
