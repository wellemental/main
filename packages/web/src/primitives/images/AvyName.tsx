import React, { PropsWithChildren } from 'react';
import Paragraph from '../typography/Paragraph';
import Favorite from '../icons/Favorite';
import Avatar from './Avatar';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { useHistory } from '../../hooks';
import { Teacher } from 'common';
import { slugify } from '../../services/helpers';

type Props = {
  source: string;
  size?: number;
  mb?: number;
  name: string;
  favoriteId?: string;
  onProfile?: boolean;
  teacher?: Teacher;
};

type ContProps = {
  onProfile: boolean;
  teacher: Teacher;
};

const LinkContainer: React.FC<ContProps & PropsWithChildren<any>> = ({
  onProfile,
  teacher,
  children,
}) => {
  const history = useHistory();
  const parent = onProfile ? (
    <Link
      underline="none"
      onClick={() => history.push(`/teacher/${slugify(teacher.name)}`)}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

  return parent;
};

const AvyName: React.FC<Props> = ({
  source,
  size,
  mb,
  name,
  favoriteId,
  onProfile,
  teacher,
}) => {
  return (
    <Box display="flex">
      <LinkContainer onProfile={onProfile} teacher={teacher}>
        <Box
          display="flex"
          flexDirection="row"
          style={{
            flex: 5,
            marginTop: '9px',
          }}>
          <Avatar source={source} mb={mb} size={size} />

          <Paragraph
            theColor="primary"
            variant={onProfile ? 'subtitle2' : 'body1'}
            style={{
              lineHeight: '40px',
              marginLeft: '10px',
              fontSize: onProfile ? '19px' : undefined,
            }}>
            {name}
          </Paragraph>
        </Box>
      </LinkContainer>

      {onProfile && favoriteId && <Favorite contentId={favoriteId} />}
    </Box>
  );
};

export default AvyName;
