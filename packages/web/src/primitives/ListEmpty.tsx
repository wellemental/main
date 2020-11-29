import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';

const ListEmpty: React.FC<ParagraphProps> = ({ children, ...props }) => (
  <Paragraph gt={1} {...props}>
    {children ? children : 'No results'}
  </Paragraph>
);

export default ListEmpty;
