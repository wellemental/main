import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { CategoryScreenRouteProp } from '../types';

type Props = {
  route: CategoryScreenRouteProp;
};

const CategoryScreen: React.FC<Props> = ({ route }) => {
  const { category } = route.params;

  return (
    <Container>
      <PageHeading
        title={category.title} // translation[category.title]}
        subtitle={
          category.description // ? translation[category.description] : undefined
        }
      />

      <ContentLoop filter={category.tag} />
    </Container>
  );
};

export default CategoryScreen;
