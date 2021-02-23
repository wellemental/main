import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';
import { useCurrentUser } from '../hooks';

const ListEmpty: React.FC<ParagraphProps> = ({ children, ...props }) => {
  const { translation } = useCurrentUser();

  return (
    <Paragraph gt={1} {...props}>
      {children ? children : translation['No results']}
    </Paragraph>
  );
};

export default ListEmpty;
