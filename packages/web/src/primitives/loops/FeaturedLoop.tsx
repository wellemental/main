import React, { useState } from 'react';
import Subheadline from '../typography/Subheadline';
import { useCurrentUser, useContent } from '../../hooks';
import { Categories, Content } from 'common';

type Props = {
  category: Categories;
};
const FeaturedLoop: React.FC<Props> = ({ category }) => {
  const { translation, user } = useCurrentUser();
  //   const { getFeatures } = useContent();

  const [features, setFeatures] = useState<Content[]>([]);
  //   const data = getFeatures(category);

  // Temporary hack to get features to updated upon language switch
  //   const filterLanguage = () => {
  //     const filtered = data.filter(content => content.language === user.language);
  //     const test = filtered.map(feature => feature.language);
  //     const twoFeatures = filtered.slice(0, 2);

  //     setFeatures(twoFeatures);
  //   };

  //   useEffect(() => {
  //     filterLanguage();
  //   }, []);

  //   useEffect(() => {
  //     filterLanguage();
  //   }, [user.language]);

  return (
    <>
      {/* <Subheadline>{translation.Featured}</Subheadline>
      <ContentLoopSmall content={features} /> */}
    </>
  );
};

export default FeaturedLoop;
