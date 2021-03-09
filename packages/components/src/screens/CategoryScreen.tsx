import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { CategoryScreenRouteProp } from '../types';
import { useCurrentUser } from '../hooks';
import { defaultAgeGroups } from '../constants';

type Props = {
  route: CategoryScreenRouteProp;
};

const CategoryScreen: React.FC<Props> = ({ route }) => {
  const { category } = route.params;
  const { translation } = useCurrentUser();

  const isAgeGroup = defaultAgeGroups.includes(category);

  console.log('FILTER ADF', category.tag);
  return (
    <Container scrollEnabled>
      <PageHeading
        title={
          isAgeGroup ? `${category.title} ${translation.years}` : category.title
        }
        subtitle={
          translation[category.description]
            ? translation[category.description]
            : category.description // ? translation[category.description] : undefined
        }
      />

      <ContentLoop filter={category.tag} />
    </Container>
  );
};

export default CategoryScreen;
