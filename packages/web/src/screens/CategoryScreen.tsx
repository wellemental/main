import React from 'react';
import { ContentLoop, PageHeading } from '../primitives';
import { useLocation } from '../hooks';

const CategoryScreen: React.FC = () => {
  const { state } = useLocation();
  const { category } = state;

  return (
    <>
      <PageHeading
        title={category.title} // translation[category.title]}
        subtitle={
          category.description // ? translation[category.description] : undefined
        }
      />

      <ContentLoop filter={category.tag} />
    </>
  );
};

export default CategoryScreen;
