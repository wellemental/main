import React from 'react';
import { Paragraph } from './';
import { ApplicationError, ModelError } from 'services';
import variables from '../assets/native-base-theme/variables/platform';

interface Props {
  error?: Error | string;
}

const ErrorComponent: React.FC<Props> = ({ error }) => {
  const text =
    undefined || error === null
      ? null
      : error instanceof ModelError
      ? error.errors().join('\n')
      : error instanceof ApplicationError
      ? error.message
      : typeof error === 'string'
      ? error
      : !error
      ? null
      : 'An unknown error occurred';

  return error ? (
    <Paragraph style={{ color: variables.brandDanger }}>{text}</Paragraph>
  ) : null;
};

export default ErrorComponent;
