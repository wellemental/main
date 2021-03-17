import React from 'react';
import { default as MuiCard, CardProps } from '@material-ui/core/Card';

const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <MuiCard {...props}>{children}</MuiCard>;
};

export default Card;
