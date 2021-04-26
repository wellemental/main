import React from 'react';
import { ContentLoop, PageHeading, Spinner } from '../primitives';
import { useContent, useRouteMatch, useCurrentUser } from '../hooks';
import {
  Category,
  categories,
  Tags,
  Feature,
  Languages,
  slugify,
} from 'common';
import { ageGroups } from '../constants';

// This filter and matching is horrible and needs to be cleaned up eventually.
const CategoryScreen: React.FC = () => {
  const { features } = useContent();
  const { translation, language } = useCurrentUser();

  // Get category slug from URL
  const match = useRouteMatch();
  let category: Category | null = null;
  let feature: Feature | null = null;
  const isAgeGroup = !!category && ageGroups.includes(category);
  const isSpanish = language === Languages.Es;

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
    feature = features.filter(category => slugify(category.title) === match)[0];
  }

  // If not ageGroup or feature, match here
  if (!category && !feature) {
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

  console.log('FEATURES', feature, 'CATE', category, 'IS AGE', isAgeGroup);

  return !category && !feature ? (
    <Spinner />
  ) : (
    <>
      <PageHeading
        title={
          feature && isSpanish // Remote config features won't have built-in translation since they're set by admins
            ? feature['title-es']
            : !!feature
            ? feature.title
            : isAgeGroup
            ? `${category.title} ${translation.years}`
            : category.title
        }
        subtitle={
          feature && isSpanish
            ? feature['description-es']
            : !!feature
            ? feature.description
            : category.description
        }
      />

      <ContentLoop filter={feature ? feature.tag : category.tag} />
    </>
  );
};

export default CategoryScreen;
