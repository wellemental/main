import React, { useState } from 'react';
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from '@material-ui/core/styles';
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
import ListItemLink from '../typography/ListItemLink';
import { useHistory } from 'react-router-dom';
import { Logo } from '../images';
import Icon from '../icons/Icon';
import app from '../../base';
import { useCurrentUser } from '../../hooks';
// import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import LibraryIcon from '../icons/LibraryIcon';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      boxShadow: 'none',
    },
    // toolbar: {
    //   display: 'flex',
    //   justifyContent: 'space-between',
    // },
    list: {
      width: 300,
    },
    fullList: {
      width: 'auto',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
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
};

const Nav: React.FC<Props> = props => {
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

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const anchor = 'left';

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const links: Link[] = [
    { label: 'Home', slug: '/', icon: 'home', pro: false },
    { label: 'Library', slug: '/library', icon: 'library', pro: false },
    { label: 'Favs', slug: '/favorites', icon: 'favorite', pro: true },
    { label: 'Search', slug: '/search', icon: 'search', pro: true },
    { label: 'Your Account', slug: '/settings', icon: 'user', pro: false },
    { label: 'Logout', slug: 'logout', icon: 'logout', pro: false },
  ];

  return user ? (
    <>
      {/* <AppBar
        // position="fixed"
        elevation={0}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        color="transparent">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}>
            <MenuIcon />
          </IconButton>
          <Logo />
        </Toolbar>
      </AppBar> */}
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}>
        <div className={classes.toolbar}>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {/* {theme.direction === 'rtl' ? ( */}
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
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
                <ListItemIcon>
                  <Icon name={link.icon} />
                </ListItemIcon>

                <ListItemText primary={translation[link.label]} />
              </ListItem>
            ),
          )}
        </List>
        <Divider />
        <ListItem
          button
          //   onClick={() => {
          //     window.location.href = 'mailto:hello@wellemental.co';
          //   }}
          onClick={() => setOpen(!open)}>
          <ListItemIcon>
            <Icon name="contact" />
          </ListItemIcon>
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
      </Drawer>
    </>
  ) : null;
};

export default Nav;
