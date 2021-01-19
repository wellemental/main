import React from 'react';
import Image from './Image';
import Link from '@material-ui/core/Link';
import Box, { BoxProps } from '@material-ui/core/Box';
import ConditionalWrapper from './ConditionalWrapper';
import { useHistory } from '../hooks';
import { makeStyles, Theme } from '@material-ui/core/styles';

type Props = {
  width?: number;
  center?: boolean;
  linked?: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  logo: (props: Props) => ({
    width: props.width ? props.width : 200,
    marginLeft: props.center ? 'auto' : undefined,
    marginRight: props.center ? 'auto' : undefined,
    paddingTop: '5px',
    [theme.breakpoints.up('md')]: {
      width: 150,
    },
  }),
}));

const Logo: React.FC<Props & BoxProps> = ({
  width,
  center,
  linked = true,
  ...props
}) => {
  const classes = useStyles({ width, center });
  const history = useHistory();

  return (
    <Box className={classes.logo} {...props}>
      <ConditionalWrapper
        condition={linked}
        wrapper={(children: React.ReactChildren) => (
          <Link onClick={() => history.push('/')}>{children}</Link>
        )}>
        <Image src="logo" width={width ? width : 200} />
      </ConditionalWrapper>
    </Box>
  );
};

export default Logo;
