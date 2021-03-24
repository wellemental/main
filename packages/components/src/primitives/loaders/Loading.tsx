import React, { useState } from 'react';
import Spinner from './Spinner';
import Paragraph from '../typography/Paragraph';
import ConditionalWrapper from '../utils/ConditionalWrapper';
import Container from '../page/Container';
import { useCurrentUser } from '../../hooks';

interface Props {
  loading: boolean;
  text?: string;
  fullPage?: boolean;
}

const minimumLoadingTime = 500;

const Loading: React.FC<Props> = ({
  loading,
  fullPage,
  text,
  children = null,
}) => {
  const [isSimulatingLoading, setSimulatedLoading] = useState(
    fullPage ? true : false,
  );
  const { translation } = useCurrentUser();

  setTimeout(() => {
    setSimulatedLoading(false);
  }, minimumLoadingTime);

  const child = typeof children === 'function' ? children() : children;

  return loading || isSimulatingLoading ? (
    <ConditionalWrapper
      condition={fullPage}
      wrapper={(spinner: React.ReactChildren) => (
        <Container
          center
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {spinner}
        </Container>
      )}>
      {fullPage && (
        <Paragraph center>
          {text ? text : translation['One moment...']}
        </Paragraph>
      )}
      <Spinner />
    </ConditionalWrapper>
  ) : (
    child
  );
};

export default Loading;
