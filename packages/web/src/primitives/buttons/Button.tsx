// Extended with extra colors. Code found at bottom of this thread - https://github.com/mui-org/material-ui/issues/14185
import React from 'react';
import {
  Button as MuiButton,
  ButtonProps,
  CircularProgress,
} from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TextTranslate from '../typography/TextTranslate';
import Icon, { Icons } from '../icons/Icon';
import { capitalize } from 'common';
import { ClassNameMap } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      [theme.breakpoints.down('sm')]: {
        marginRight: '0',
        width: '100%',
      },
    },
    containedWarning: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    containedSuccess: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.success.dark,
      },
    },
    containedLight: {
      backgroundColor: theme.palette.info.main,
      color: 'rgba(0,0,0,.65)',
      '&:hover': {
        backgroundColor: theme.palette.info.dark,
      },
    },
  }),
);

export type ColorTypes =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'light'
  | 'error'
  | 'info'
  | 'success'
  | 'default'
  | 'inherit';

// Necessary in order to extend Material-UI to have colors outside of primary and secondary
export type ColoredButtonProps = { color?: ColorTypes } & Omit<
  ButtonProps,
  'color'
>;
interface Props extends ColoredButtonProps {
  loading?: boolean;
  text?: string;
  onPress?: () => void;
  iconName?: Icons;
}

const Button: React.FC<Props> = ({
  loading = false,
  text,
  disabled = false,
  children,
  onPress,
  iconName,
  color,
  variant = 'contained',
  ...props
}) => {
  const classes = useStyles();

  // @ts-ignore
  const className = classes[`${variant}${capitalize(color)}`];
  const colorProp =
    color === undefined
      ? 'primary'
      : ['default', 'inherit', 'primary', 'secondary'].indexOf(color) > -1
      ? (color as 'default' | 'inherit' | 'primary' | 'secondary')
      : undefined;

  return (
    <MuiButton
      className={`${classes.button} ${className}`}
      variant={variant}
      size="large"
      color={colorProp}
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
