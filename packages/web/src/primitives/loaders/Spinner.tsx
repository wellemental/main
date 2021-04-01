import React from 'react';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinning: {
      textAlign: 'center',
    },
  }),
);

type Props = {
  text?: string;
  fullPage?: boolean;
};

const Spinner: React.FC<Props> = ({ text, fullPage }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.spinning}
      style={{
        height: fullPage ? '100vh' : undefined,
        margin: fullPage ? '20px 0' : 0,
      }}>
      <Grid item xs={12}>
        {text && (
          <Typography variant="subtitle2" gutterBottom>
            {text}
          </Typography>
        )}
        <CircularProgress />
      </Grid>
    </Grid>
  );
};

export default Spinner;
