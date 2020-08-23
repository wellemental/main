import React from 'react';
import { Spinner as NBSpinner } from 'native-base';
import Paragraph from './Paragraph';
import Container from './Container';

type Props = {
  text?: string;
};

const Spinner: React.FC<Props> = ({ text }) => {
  return (
    <Container center>
      {text && <Paragraph>{text}</Paragraph>}
      <NBSpinner />
    </Container>
  );
};

export default Spinner;
