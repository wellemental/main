import React from 'react';
import { Subheadline, CategoryCard } from '.';
import { useCurrentUser } from '../hooks';
import { Category } from 'common';

type Props = {
  categories: Category[];
};

const colors = ['yellow', 'blurple', 'orange', 'teal'];

const CategoryLoop: React.FC<Props> = ({ categories }) => {
  const { translation } = useCurrentUser();

  return (
    <>
      <Subheadline>{translation.Categories}</Subheadline>

      {categories.map((category, idx) => (
        <CategoryCard
          key={category.title}
          color={colors[idx]}
          category={category}
        />
      ))}
    </>
  );
};

export default CategoryLoop;
