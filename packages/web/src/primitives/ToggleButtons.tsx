import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

type Props = {
  state: any;
  setState: React.SetStateAction<any>;
  buttons: any;
  fullWidth?: boolean;
};

const ToggleButtons: React.FC<Props> = ({
  buttons,
  state,
  setState,
  fullWidth = true,
}) => {
  const toggleState = (event: any, newState: any) => {
    setState(newState);
  };

  const width = `${100 / buttons.length}%`;

  return (
    <ToggleButtonGroup
      value={state}
      exclusive
      onChange={toggleState}
      aria-label="toggle"
      style={{ width: fullWidth ? '100%' : 'inherit' }}>
      {buttons.map((btn: string) => (
        <ToggleButton value={btn} aria-label={btn} style={{ width: width }}>
          {btn}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
