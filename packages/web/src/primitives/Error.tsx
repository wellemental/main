import React from 'react';
// import { Typography } from '@material-ui/core';
import Paragraph from './Paragraph';
import { ApplicationError, ModelError } from '../models/Errors';

interface Props {
  error?: Error | string;
  center?: boolean;
}

const Error: React.FC<Props> = ({
  error,
  center,
}): React.ReactElement | null => {
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

  return error ? (
    <Paragraph center={center ? center : false} fine color="secondary">
      {text}
    </Paragraph>
  ) : null;
};

export default Error;
