import React from 'react';
import Headline from '../typography/Headline';

type Props = {
  text: string;
  center?: boolean;
};

const CardTitle: React.FC<Props> = ({ text, center }) => {
  return (
    <Headline
      component="h3"
      variant="subtitle2"
      noWrap
      style={{ textAlign: center ? 'center' : 'left' }}>
      {text}
    </Headline>
  );
};

export default CardTitle;
