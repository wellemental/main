import React from 'react';
import Box from '../utils/Box';
import Link from '@material-ui/core/Link';
import Paragraph from '../typography/Paragraph';
import { useCurrentUser } from '../../hooks';

const Footer = () => {
  const { user, translation } = useCurrentUser();
  return (
    <Box mx={2} mt={4} mb={2}>
      <Paragraph fine center color="textSecondary">
        Wellemental ©2021 -{' '}
        <Link href="https://wellemental.zendesk.com/">
          {translation['Need help?']}
        </Link>
      </Paragraph>
      {user.isAdmin && (
        <Paragraph fine center color="textSecondary">
          {user.email} - {user.id}
        </Paragraph>
      )}
    </Box>
  );
};

export default Footer;
