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
  ListItemText,
  Slide,
  Button,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Box } from '../primitives';
import { Menu as MenuIcon, ExitToApp as LogoutIcon } from '@material-ui/icons';
import ListItemLink from './ListItemLink';
import { Logo } from './';
import app from '../base';
import { useCurrentUser, usePageviews, useHistory } from '../hooks';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Icon from './Icon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      boxShadow: 'none',
    },
    icon: {
      color: '#999',
      minWidth: '35px',
    },
    linktext: {
      color: '#999',
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
    mobileNavIcon: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    desktopNav: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
  }),
);

type Link = {
  label: string;
  slug: string;
  icon: string;
  pro: boolean;
  // loggedIn: boolean;
};

const links: { [key: string]: Link } = {
  Home: { label: 'Home', slug: '/', icon: 'home', pro: false },
  Library: {
    label: 'Library',
    slug: '/library',
    icon: 'library',
    pro: false,
  },
  Favorites: {
    label: 'Favorites',
    slug: '/favorites',
    icon: 'favorite',
    pro: true,
  },
  // Profile: { label: 'Profile', slug: '/profile', icon: 'user', pro: true },
  Search: { label: 'Search', slug: '/search', icon: 'search', pro: true },
  Settings: {
    label: 'Your Account',
    slug: '/settings',
    icon: 'user', //'settings',
    pro: false,
  },
  Help: {
    label: 'Help',
    slug: 'support', // '/settings',
    icon: 'support',
    pro: false,
  },
  Logout: { label: 'Logout', slug: 'logout', icon: 'logout', pro: false },
};

const mobileMainMenu = Object.values(links);

const desktopMainMenu = [
  links.Home,
  links.Library,
  links.Favorites,
  // links.Profile,
  links.Search,
];
const desktopRightMenu = [links.Settings, links.Help, links.Logout];

type Props = {
  title?: string;
};

type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Nav: React.FC<Props> = (props) => {
  usePageviews();
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

  // Desktop Right Menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const toggleDesktopMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeDesktopMenu = () => {
    setAnchorEl(null);
  };

  const handleClick = (slug: string, closeSideMenu?: boolean) => {
    if (slug === 'logout') {
      app.auth().signOut();
    } else if (slug === 'support') {
      window.open('https://wellemental.zendesk.com/', '_blank');
    } else {
      history.push(slug);
    }
    if (closeSideMenu) {
      closeDesktopMenu();
    }
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

        {mobileMainMenu.map((link) =>
          link.pro && !activePlan ? null : (
            <ListItem
              button
              key={link.label}
              onClick={() => handleClick(link.slug)}>
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
              className={classes.mobileNavIcon}
              onClick={toggleDrawer(anchor, true)}>
              <MenuIcon />
            </IconButton>

            <Logo style={{ marginRight: '8px', marginTop: '2px' }} />

            <List disablePadding className={classes.desktopNav}>
              {desktopMainMenu.map((link) =>
                link.pro && !activePlan ? null : (
                  <ListItem
                    dense
                    button
                    key={link.label}
                    onClick={() => handleClick(link.slug)}>
                    <ListItemIcon className={classes.icon}>
                      <Icon name={link.icon} />
                    </ListItemIcon>

                    <ListItemText
                      primaryTypographyProps={{ style: { color: '#666' } }}
                      primary={translation[link.label]}
                    />
                  </ListItem>
                ),
              )}
            </List>
          </Box>

          <Slide appear={true} direction="down" in={!user}>
            <Button
              size="small"
              variant="text"
              onClick={() => history.push('/login')}>
              Login
            </Button>
          </Slide>

          {/* <Slide appear={true} direction="down" in={user}> */}
          <IconButton
            className={classes.desktopNav}
            edge="start"
            aria-controls="desktop-menu"
            aria-haspopup="true"
            onClick={toggleDesktopMenu}>
            {/* <Icon name="settings" /> */}
            <Icon name="user" />
          </IconButton>
          <Menu
            id="desktop-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={closeDesktopMenu}>
            {desktopRightMenu.map((link) => (
              <MenuItem
                onClick={() => handleClick(link.slug, true)}
                key={link.label}>
                <ListItemIcon className={classes.icon}>
                  <Icon name={link.icon} />
                </ListItemIcon>
                {link.label}
              </MenuItem>
            ))}
          </Menu>
          {/* </Slide> */}
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
