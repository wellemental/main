import React from 'react';
import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TextTranslate from '../typography/TextTranslate';
import Icon, { Icons } from '../icons/Icon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      [theme.breakpoints.down('sm')]: {
        marginRight: '0',
        width: '100%',
      },
    },
  }),
);

type Props = {
  loading?: boolean;
  text?: string;
  onPress?: () => void;
  iconName?: Icons;
};

const Button: React.FC<Props & ButtonProps> = ({
  loading = false,
  text,
  disabled = false,
  children,
  onPress,
  iconName,
  ...props
}) => {
  const classes = useStyles();

  return (
    <MuiButton
      className={classes.button}
      variant={props.variant ? props.variant : 'contained'}
      size="large"
      color={props.color ? props.color : 'primary'}
      disabled={loading || disabled}
      onClick={onPress ? onPress : props.onClick}
      startIcon={iconName ? <Icon name={iconName} /> : undefined}
      {...props}>
      {loading ? (
        <CircularProgress size={26} />
      ) : text ? (
        <TextTranslate>{text}</TextTranslate>
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;
