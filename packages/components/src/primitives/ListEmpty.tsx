import React from 'react';
import { Props } from './Text';
import Paragraph, { ParagraphProps } from './Paragraph';
import variables from '../assets/native-base-theme/variables/wellemental';

const ListEmpty: React.FC<ParagraphProps & Props> = (props) => (
  <Paragraph
    padder="top"
    center
    {...props}
    style={{ color: variables.lightTextColor }}
  />
);

export default ListEmpty;
