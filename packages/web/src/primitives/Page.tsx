import React, { ReactNode } from 'react';
import {
  Container,
  Grid,
  CssBaseline,
  ContainerProps,
} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { imageDir } from '../models/Image';

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

interface Props {
  children: ReactNode | HTMLCollection;
  fullPage?: boolean;
  noNav?: boolean;
  disableGutters?: boolean;
  background?: 'general' | 'grass';
}

const Page: React.FC<Props & ContainerProps> = ({
  children,
  fullPage,
  noNav,
  disableGutters,
  background,
  ...props
}) => {
  const classes = useStyles();

  const bgStyle = background
    ? {
        backgroundImage:
          background === 'general'
            ? `url(${imageDir.bgGeneral.source.safari})`
            : `url(${imageDir.bgGrass.source.safari})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        minHeight: '100vh',
      }
    : {};

  return (
    <div style={bgStyle}>
      <CssBaseline />
      <Container
        maxWidth="xs"
        component="main"
        disableGutters={disableGutters ? disableGutters : false}
        {...props}>
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
