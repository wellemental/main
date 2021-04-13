import React, { useState, useEffect } from 'react';
import Subheadline from '../typography/Subheadline';
import ContentLoopSmall from './ContentLoopSmall';
import { useCurrentUser, useContent, useContainer } from '../../hooks';
import {
  Categories,
  Content,
  ContentServiceType,
  getTwoRandomInt,
} from 'common';

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

  // Temporary hack to get features to update upon language switch
  const filterLanguage = () => {
    const filtered = data.filter(content => content.language === user.language);
    const totalItems = filtered.length;

    // If there's less than three featured items, just set the arr as-is
    // If there's more than three featured items, select two random indexes from the array
    const twoFeatures =
      totalItems < 3
        ? filtered
        : getTwoRandomInt(totalItems).map(idx => filtered[idx]);

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
