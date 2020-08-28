import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { useCurrentUser } from '../hooks';
import { CategoryScreenRouteProp } from '../types';

type Props = {
  route: CategoryScreenRouteProp;
};

const CategoryScreen: React.FC<Props> = ({ route }) => {
  const { translation } = useCurrentUser();
  const { category } = route.params;
  console.log('CATEGORY', category);

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
