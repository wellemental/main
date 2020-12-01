import React from 'react';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinning: {
      textAlign: 'center',
      height: '100vh',
    },
  }),
);

type Props = {
  text?: string;
};

const Spinner: React.FC<Props> = ({ text }) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.spinning}>
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
