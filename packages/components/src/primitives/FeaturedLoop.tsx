import React from 'react';
import { ContentLoopSmall, Subheadline } from '../primitives';
import { useCurrentUser, useContent } from '../hooks';
import { Categories } from 'common';

type Props = {
  category: Categories;
};
const FeaturedLoop: React.FC<Props> = ({ category }) => {
  const { translation, user } = useCurrentUser();
  const { getFeatures } = useContent();

  const data = getFeatures(category);

  return (
    <>
      <Subheadline>{translation.Featured}</Subheadline>
      <ContentLoopSmall
        content={data
          .filter((content) => (content.language = user.language))
          .slice(0, 2)}
      />
    </>
  );
};

export default FeaturedLoop;
