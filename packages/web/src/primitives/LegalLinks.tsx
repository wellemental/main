import React from 'react';
import Paragraph from './Paragraph';
import Box from './Box';
import { brandColors } from '../assets/styles/theme';
import { useCurrentUser } from '../hooks';
import Link from '@material-ui/core/Link';

type Props = {
  subs?: boolean;
};

const LegalLinks: React.FC<Props> = ({ subs }) => {
  const { translation } = useCurrentUser();
  return (
    <Box my={1.5}>
      <Paragraph fine center style={{ color: '#999', marginBottom: 20 }}>
        {subs &&
          translation['Recurring billing. Cancel anytime for any reason.']}
        {translation['By joining Wellemental you agree to our ']}
        <Link href="https://www.wellemental.co/terms">
          {translation['terms of use']}
        </Link>{' '}
        <Paragraph>{translation.and} </Paragraph>
        <Link href="https://www.wellemental.co/privacy">
          {translation['privacy policy']}.
        </Link>
      </Paragraph>
    </Box>
  );
};

export default LegalLinks;
