import React, { useState, useEffect, useRef } from 'react';
import Subheadline from '../typography/Subheadline';
import ContentLoopSmall from './ContentLoopSmall';
import { useCurrentUser, useContent, useContainer } from '../../hooks';
import { Categories, Content, ContentServiceType } from 'common';
import { ContentService } from '../../services/';

type Props = {
  category: Categories;
};
const FeaturedLoop: React.FC<Props> = ({ category }) => {
  const { translation, user } = useCurrentUser();
  const { content } = useContent();
  const container = useContainer();
  const service = container.getInstance<ContentServiceType>('contentService');

  const [features, setFeatures] = useState<Content[]>([]);

  const data = content ? service.getFeatures(category, content) : [];

  // Temporary hack to get features to updated upon language switch
  const filterLanguage = () => {
    const filtered = data.filter(content => content.language === user.language);
    const twoFeatures = filtered.slice(0, 2);

    setFeatures(twoFeatures);
  };

  useEffect(() => {
    filterLanguage();
  }, []);

  useEffect(() => {
    filterLanguage();
  }, [user.language]);

  return (
    <>
      <Subheadline>{translation.Featured}</Subheadline>
      <ContentLoopSmall content={features} />
    </>
  );
};

export default FeaturedLoop;
