import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  // ListItemIcon,
  ListItemText,
  Slide,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  // AccountCircle as UserIcon,
  ExitToApp as LogoutIcon,
} from '@material-ui/icons';
import ListItemLink from './ListItemLink';
import { useHistory } from 'react-router-dom';
import { Logo } from './';
import app from '../base';
import { useCurrentUser } from '../hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      boxShadow: 'none',
    },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    list: {
      width: 300,
    },
    fullList: {
      width: 'auto',
    },
  }),
);

type Props = {
  title?: string;
};

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Nav: React.FC<Props> = (props) => {
  const classes = useStyles();
  const { user, auth, activePlan, translation } = useCurrentUser();
  const history = useHistory();
  // const trigger = useScrollTrigger();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const anchor = 'left';

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor: Anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      <List>
        {!user && !!auth && (
          <ListItemLink
            to="/login"
            primary={translation.Login}
            icon={<LogoutIcon />}
          />
        )}

        <ListItemLink to="/" primary={translation.Home} />
        <ListItemLink to="/library" primary={translation.Library} />
        {activePlan && (
          <>
            <ListItemLink to="/favorites" primary={translation.Favorites} />
            <ListItemLink to="/search" primary={translation.Search} />
          </>
        )}
        {!!user && !!auth && (
          <>
            <ListItem
              button
              onClick={() => history.push('/settings')}
              alignItems="flex-start">
              <ListItemText
                primary={translation['Account']}
                // secondary={
                //   <Typography
                //     component="span"
                //     variant="body2"
                //     color="textSecondary">
                //     {auth.email}
                //   </Typography>
                // }
              />
            </ListItem>

            <ListItem button onClick={() => app.auth().signOut()}>
              <ListItemText primary={translation.Logout} />
            </ListItem>
          </>
        )}
        <Divider />
        <ListItem
          button
          onClick={() => {
            window.location.href = 'mailto:hello@wellemental.co';
          }}>
          <ListItemText
            primary={translation['Contact Us']}
            secondary={
              <Typography
                component="span"
                variant="body2"
                color="textSecondary">
                hello@wellemental.co
              </Typography>
            }
          />
        </ListItem>
      </List>
    </div>
  );

  return user ? (
    <>
      <AppBar color="transparent" position="relative" className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Box flexDirection="row" display="flex">
            <IconButton
              edge="start"
              aria-label="menu"
              onClick={toggleDrawer(anchor, true)}>
              <MenuIcon />
            </IconButton>

            <Logo />
          </Box>

          <Slide appear={true} direction="down" in={!user}>
            <Button
              size="small"
              variant="text"
              onClick={() => history.push('/login')}>
              Login
            </Button>
          </Slide>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}>
        {list(anchor)}
      </Drawer>
    </>
  ) : null;
};

export default Nav;
