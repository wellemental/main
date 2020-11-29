import React from 'react';
import { Box, TextField, TextFieldProps } from '@material-ui/core';

type Props = {
  onKeyPress?: () => void;
  changeState?: (text: string) => void;
  mt?: number;
  mb?: number;
  box?: any;
};

const Input: React.FC<Props & TextFieldProps> = ({
  onKeyPress,
  changeState,
  mt = 0,
  mb = 0,
  box,
  ...props
}) => {
  // Format onChange function properly to setState or leave uncontrolled
  let onChangeFunc: any = changeState
    ? (e: any) => changeState(e.target.value)
    : undefined;

  // Handle legacy onChange prop textFields
  if (!changeState && props.onChange) {
    onChangeFunc = props.onChange;
  }

  // If onKeyPress is defined, call passed function
  const keyPressed = (event: any): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onKeyPress) {
        onKeyPress();
      }
    }
  };

  return (
    <Box mt={mt ? mt : 3} mb={mb} style={{ width: '100%' }}>
      <TextField
        onChange={onChangeFunc}
        variant="standard"
        onKeyPress={onKeyPress ? keyPressed : undefined}
        fullWidth={props.fullWidth ? props.fullWidth : true}
        name={props.label ? props.label.toString().toLowerCase() : undefined}
        {...props}
      />
    </Box>
  );
};

export default Input;
