import React from 'react';
import MuiBox, { BoxProps as MuiBoxProps } from '@material-ui/core/Box';

export interface BoxProps extends MuiBoxProps {
  row?: boolean;
  center?: boolean;
}

const Box: React.FC<BoxProps> = ({
  row = false,
  center,
  children,
  ...props
}) => {
  let styles = {};

  if (center) {
    styles = {
      height: 'calc(100vh - 57px)',
      justifyContent: 'center',
    };
  }

  return (
    <MuiBox
      display={row || center ? 'flex' : props.display ? props.display : 'block'}
      flexDirection={
        row
          ? 'row'
          : center
          ? 'column'
          : props.flexDirection
          ? props.flexDirection
          : undefined
      }
      style={styles}
      {...props}>
      {children}
    </MuiBox>
  );
};

export default Box;
