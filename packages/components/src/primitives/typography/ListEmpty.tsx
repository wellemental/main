import React from 'react';
import Paragraph, { ParagraphProps } from './Paragraph';
import { NativeBase } from 'native-base';
import variables from '../../assets/native-base-theme/variables/wellemental';

const ListEmpty: React.FC<ParagraphProps & NativeBase.Text> = ({
  children,
  ...props
}) => (
  <Paragraph
    gt={1}
    {...props}
    style={{ color: variables.lightTextColor, paddingHorizontal: 5 }}>
    {children ? children : 'No results'}
  </Paragraph>
);

export default ListEmpty;
