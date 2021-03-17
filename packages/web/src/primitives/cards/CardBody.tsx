// Just changing name to match with Native-Base mobile for easier copying
import React from 'react';
import { CardContent, CardContentProps } from '@material-ui/core';

const CardBody: React.FC<CardContentProps> = ({ children }) => {
  return (
    <CardContent
      style={{
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15,
        paddingBottom: 15,
      }}>
      {children}
    </CardContent>
  );
};

export default CardBody;
