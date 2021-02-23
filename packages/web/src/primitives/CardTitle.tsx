import React from 'react';
import Typography, { TypographyProps } from '@material-ui/core/Typography';

type Props = {
  text: string;
};

const CardTitle: React.FC<Props> = ({ text }) => {
  return (
    <Typography component="h3" variant="subtitle2" noWrap>
      {text}
    </Typography>
  );
};

export default CardTitle;
