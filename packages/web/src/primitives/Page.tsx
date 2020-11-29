import React, { ReactNode } from 'react';
import {
  Container,
  Grid,
  CssBaseline,
  ContainerProps,
} from '@material-ui/core';
import { useHistory, useCurrentUser } from '../hooks';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    center: {
      height: 'calc(100vh + 13px)',
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
  disableGutters?: boolean;
}

const Page: React.FC<Props & ContainerProps> = ({
  children,
  fullPage,
  disableGutters,
}) => {
  const classes = useStyles();
  const { auth } = useCurrentUser();
  const history = useHistory();

  return (
    <>
      <CssBaseline />
      <Container
        maxWidth="xs"
        component="main"
        disableGutters={disableGutters ? disableGutters : false}>
        <Grid container className={`${fullPage ? '' : classes.center}`}>
          <Grid xs={12} item>
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Page;
