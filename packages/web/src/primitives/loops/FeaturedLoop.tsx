import React from 'react';
import Subheadline from '../typography/Subheadline';
import ContentLoop from './ContentLoop';
import { Categories, Tags } from 'common';

type Props = {
  category: Categories;
};
const FeaturedLoop: React.FC<Props> = ({ category }) => {
  return (
    <>
      <Subheadline>Featured</Subheadline>
      <ContentLoop small type={category} filter={Tags.Featured} random={2} />
    </>
  );
};

export default FeaturedLoop;
