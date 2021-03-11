import React from 'react';
import { NativeBase } from 'native-base';
import Paragraph, { ParagraphProps } from './Paragraph';

const CardTitle: React.FC<ParagraphProps & NativeBase.Text> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Paragraph
      color="brandPrimary"
      numberOfLines={1}
      style={[
        {
          fontSize: 20,
          lineHeight: 24,
          fontWeight: '500',
          marginBottom: 5,
          marginBottom: 3,
        },
        style,
      ]}
      {...props}>
      {children}
    </Paragraph>
  );
};

export default CardTitle;
