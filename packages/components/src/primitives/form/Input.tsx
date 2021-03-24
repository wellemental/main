import React from 'react';
import { Input as NBInput, Item, Label, NativeBase } from 'native-base';
import styled from 'styled-components';

type Props = {
  label?: string;
  value: string;
  autoFocus?: boolean;
  onChangeText: React.Dispatch<React.SetStateAction<string>>;
};

const InputItem = styled(Item)`
  margin-bottom: 25px;
  margin-left: 0px;
`;

const Input: React.FC<Props & NativeBase.Input> = ({
  label,
  value,
  autoFocus,
  onChangeText,
  ...props
}) => {
  return (
    <InputItem stackedLabel style={{ alignSelf: 'stretch' }}>
      {label && <Label>{label}</Label>}
      <NBInput
        value={value}
        autoFocus={autoFocus ? autoFocus : false}
        onChangeText={onChangeText}
        {...props}
      />
    </InputItem>
  );
};

export default Input;
