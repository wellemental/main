import React from 'react';
import { Container, ContentLoop, PageHeading } from '../primitives';
import { CategoryScreenRouteProp } from '../types';
import { useCurrentUser } from '../hooks';
import { defaultAgeGroups } from '../constants';
import { Languages } from 'common';

type Props = {
  route: CategoryScreenRouteProp;
};

const CategoryScreen: React.FC<Props> = ({ route }) => {
  const { category } = route.params;
  const { translation, language } = useCurrentUser();

  const isSpanish = language === Languages.Es;
  const isAgeGroup = defaultAgeGroups.includes(category);

  return (
    <Container noPadding="vertical">
      <ContentLoop
        scrollEnabled
        autoLoadMore={category?.slug === 'philosophy'}
        filter={category.tag}
        header={
          <PageHeading
            title={
              // Remote config features won't have built-in translation since they're set by admins
              category['title-es'] && isSpanish
                ? category['title-es']
                : isAgeGroup
                ? `${category.title} ${translation.years}`
                : category.title
            }
            subtitle={
              category['description-es'] && isSpanish
                ? category['description-es']
                : category.description
            }
          />
        }
      />
    </Container>
  );
};

export default CategoryScreen;
