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
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from './Icon';

const drawerWidth = 240;

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

type Link = {
  label: string;
  slug: string;
  icon: string;
  pro: boolean;
  // loggedIn: boolean;
};

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

  const links: Link[] = [
    { label: 'Home', slug: '/', icon: 'home', pro: false },
    { label: 'Library', slug: '/library', icon: 'library', pro: false },
    { label: 'Favs', slug: '/favorites', icon: 'favorite', pro: true },
    { label: 'Search', slug: '/search', icon: 'search', pro: true },
    { label: 'Your Account', slug: '/settings', icon: 'user', pro: false },
    { label: 'Logout', slug: 'logout', icon: 'logout', pro: false },
  ];

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

        {links.map((link, index) =>
          link.pro && !activePlan ? null : (
            <ListItem
              button
              key={link.label}
              onClick={() =>
                link.slug === 'logout'
                  ? app.auth().signOut()
                  : history.push(link.slug)
              }>
              <Box>
                <ListItemIcon>
                  <Icon name={link.icon} />
                </ListItemIcon>
              </Box>
              <ListItemText primary={translation[link.label]} />
            </ListItem>
          ),
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
