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
import ListItemLink from './ListItemLink';
import { useHistory } from 'react-router-dom';
import { Logo } from './';
import app from '../base';
import { useCurrentUser } from '../hooks';
// import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import LibraryIcon from './LibraryIcon';

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

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const anchor = 'left';

  // const toggleDrawer = (anchor: Anchor, open: boolean) => (
  //   event: React.KeyboardEvent | React.MouseEvent,
  // ) => {
  //   if (
  //     event.type === 'keydown' &&
  //     ((event as React.KeyboardEvent).key === 'Tab' ||
  //       (event as React.KeyboardEvent).key === 'Shift')
  //   ) {
  //     return;
  //   }

  //   setState({ ...state, [anchor]: open });
  // };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const list = (anchor: Anchor) => (
  //   <div
  //     className={clsx(classes.list, {
  //       [classes.fullList]: anchor === 'top' || anchor === 'bottom',
  //     })}
  //     role="presentation"
  //     onClick={toggleDrawer(anchor, false)}
  //     onKeyDown={toggleDrawer(anchor, false)}>
  //     <List>
  //       {!user && !!auth && (
  //         <ListItemLink
  //           to="/login"
  //           primary={translation.Login}
  //           icon={<LogoutIcon />}
  //         />
  //       )}

  //       <ListItemLink to="/" primary={translation.Home} />
  //       <ListItemLink to="/library" primary={translation.Library} />
  //       {activePlan && (
  //         <>
  //           <ListItemLink to="/favorites" primary={translation.Favorites} />
  //           <ListItemLink to="/search" primary={translation.Search} />
  //         </>
  //       )}
  //       {!!user && !!auth && (
  //         <>
  //           <ListItem
  //             button
  //             onClick={() => history.push('/settings')}
  //             alignItems="flex-start">
  //             <ListItemText
  //               primary={translation['Account']}
  //               // secondary={
  //               //   <Typography
  //               //     component="span"
  //               //     variant="body2"
  //               //     color="textSecondary">
  //               //     {auth.email}
  //               //   </Typography>
  //               // }
  //             />
  //           </ListItem>

  //           <ListItem button onClick={() => app.auth().signOut()}>
  //             <ListItemText primary={translation.Logout} />
  //           </ListItem>
  //         </>
  //       )}
  //       <Divider />
  //       <ListItem
  //         button
  //         onClick={() => {
  //           window.location.href = 'mailto:hello@wellemental.co';
  //         }}>
  //         <ListItemText
  //           primary={translation['Contact Us']}
  //           secondary={
  //             <Typography
  //               component="span"
  //               variant="body2"
  //               color="textSecondary">
  //               hello@wellemental.co
  //             </Typography>
  //           }
  //         />
  //       </ListItem>
  //     </List>
  //   </div>
  // );

  return user ? (
    <>
      {/* <AppBar color="transparent" position="relative" className={classes.root}>
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
      </Drawer> */}
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}>
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
          <Typography variant="h6" noWrap>
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {['Home', 'Library', 'Favs', 'Search', 'Settings'].map(
            (text, index) => (
              <ListItem button key={text}>
                <Box>
                  <ListItemIcon>
                    {index % 2 === 0 ? <LibraryIcon /> : <LibraryIcon />}
                  </ListItemIcon>
                  <ListItemText style={{ fontSize: '10px' }} primary={text} />
                </Box>
                <ListItemText primary={text} />
              </ListItem>
            ),
          )}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  ) : null;
};

export default Nav;
