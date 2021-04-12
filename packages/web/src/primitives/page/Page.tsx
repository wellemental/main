import React, { ReactNode } from 'react';
import {
  Container,
  Grid,
  CssBaseline,
  ContainerProps,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { imageDir } from '../../models/Image';
import { useLocation } from '../../hooks';
import { getTimeOfDay } from 'common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      height: 'calc(100vh - 65px)',
      justifyContent: 'center',
      textAlign: 'center',
    },
    logoFixed: {
      position: 'absolute',
      width: '100%',
      top: 0,
    },
  }),
);

const backgrounds: { [key: string]: string } = {
  sleep: `url(${imageDir.bgSleep.source.safari})`,
  night: `url(${imageDir.bgSleep.source.safari})`,
  evening: `url(${imageDir.bgSleep.source.safari})`,
  learn: `url(${imageDir.bgLearn.source.safari})`,
  move: `url(${imageDir.bgMove.source.safari})`,
  afternoon: `url(${imageDir.bgAfternoon.source.safari})`,
  morning: `url(${imageDir.bgMorning.source.safari})`,
  general: `url(${imageDir.bgGeneral.source.safari})`,
};

interface Props {
  children: ReactNode | HTMLCollection;
  fullPage?: boolean;
  background?: 'general' | 'grass';
}

const Page: React.FC<Props & ContainerProps> = ({
  children,
  fullPage,
  background,
  ...props
}) => {
  const classes = useStyles();
  const { location } = useLocation();
  const timeOfDay = getTimeOfDay();

  const noNav =
    location.pathname === '/forgot-password' ||
    location.pathname === '/login' ||
    location.pathname === '/access';

  const containerWidth = location.pathname === '/analytics' ? 'xl' : 'xs';

  const bgStyle = background
    ? {
        backgroundImage:
          location.pathname === '/'
            ? backgrounds[timeOfDay.name.toLowerCase()] // Set background to morning, afternoon, or night
            : backgrounds[location.pathname.substring(1)]
            ? backgrounds[location.pathname.substring(1)] // Set background for main category pages
            : `url(${imageDir.bgGeneral.source.safari})`, // General background for everything else
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        minHeight: noNav ? '100vh' : 'calc(100vh - 57px)',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <div style={bgStyle}>
      <CssBaseline />
      <Container maxWidth={containerWidth} component="main" {...props}>
        <Grid
          container
          className={`${fullPage ? '' : classes.center}`}
          style={{ height: noNav ? '100vh' : 'inherit' }}>
          <Grid xs={12} item>
            {children}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Page;
