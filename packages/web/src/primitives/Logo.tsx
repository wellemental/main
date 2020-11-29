import React from 'react';
import Image from './Image';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import { useHistory } from '../hooks';
import { makeStyles, Theme } from '@material-ui/core/styles';

type Props = {
  width?: number;
};

const useStyles = makeStyles((theme: Theme) => ({
  logo: (props: Props) => ({
    width: props.width ? props.width : 200,
    [theme.breakpoints.up('md')]: {
      width: 150,
    },
  }),
}));

const Logo: React.FC<Props> = ({ width, ...props }) => {
  const classes = useStyles(props);
  const history = useHistory();

  return (
    <Box className={classes.logo}>
      <Link onClick={() => history.push('/')}>
        <Image src="logo" width={width ? width : 200} />
      </Link>
    </Box>
  );
};

export default Logo;
