import React from 'react';
import Paragraph from './Paragraph';
import { ApplicationError, ModelError } from 'services';
import variables from '../../assets/native-base-theme/variables/wellemental';

interface Props {
  error?: Error | string;
  center?: boolean;
  success?: boolean;
}

const ErrorComponent: React.FC<Props> = ({ error, center, success }) => {
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
    <Paragraph
      gt={1}
      style={{
        color: success ? variables.brandInfo : variables.brandDanger,
        paddingHorizontal: 5,
        alignSelf: center ? 'center' : 'flex-start',
        textAlign: center ? 'center' : 'left',
        lineHeight: 22,
      }}>
      {text}
    </Paragraph>
  ) : (
    <></>
  );
};

export default ErrorComponent;
