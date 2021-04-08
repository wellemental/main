import React from 'react';
import Headline from '../typography/Headline';

type Props = {
  text: string;
};

const CardTitle: React.FC<Props> = ({ text }) => {
  return (
    <Headline
      component="h3"
      variant="subtitle2"
      noWrap
      style={{ textAlign: 'left' }}>
      {text}
    </Headline>
  );
};

export default CardTitle;
