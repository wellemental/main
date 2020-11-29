import React from 'react';
import { Typography } from '@material-ui/core';
import { ApplicationError, ModelError } from '../models/Errors';

interface Props {
  error?: Error | string;
}

const Error: React.FC<Props> = ({ error }): React.ReactElement | null => {
  const text =
    undefined || error === null
      ? null
      : error instanceof ModelError
      ? error.errors().join('\n')
      : error instanceof ApplicationError
      ? error.message
      : error && typeof error !== 'string' && error.message
      ? error.message
      : typeof error === 'string'
      ? error
      : !error
      ? null
      : 'An unknown error occurred';

  return error ? <Typography color="secondary">{text}</Typography> : null;
};

export default Error;
