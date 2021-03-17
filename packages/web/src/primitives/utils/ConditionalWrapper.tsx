import React from 'react';

type Props = {
  condition: boolean;
  wrapper: any;
};

const ConditionalWrapper: React.FC<Props> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
