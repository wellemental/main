import React from 'react';
import Paragraph from './Paragraph';
import { ApplicationError, ModelError } from 'services';
import variables from '../assets/native-base-theme/variables/wellemental';

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
    <Paragraph gt={2} style={{ color: variables.brandDanger }}>
      {text}
    </Paragraph>
  ) : null;
};

export default ErrorComponent;
