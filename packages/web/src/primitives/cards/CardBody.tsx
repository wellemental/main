// Just changing name to match with Native-Base mobile for easier copying
import React from 'react';
import { CardContent, CardContentProps } from '@material-ui/core';

type Props = {
  twoColumns?: boolean;
};
const CardBody: React.FC<Props & CardContentProps> = ({
  twoColumns,
  children,
  ...props
}) => {
  const styles = twoColumns
    ? {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 15,
        paddingBottom: 15,
      }
    : undefined;

  return (
    <CardContent style={styles} {...props}>
      {children}
    </CardContent>
  );
};

export default CardBody;
