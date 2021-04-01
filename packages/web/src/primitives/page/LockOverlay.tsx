import React from 'react';
import Headline from '../typography/Headline';
import Paragraph from '../typography/Paragraph';
import Button from '../buttons/Button';
import Box from '../utils/Box';
import { useCurrentUser, useNavigation } from '../../hooks';

type Props = {
  pb?: number;
};
const LockOverlay: React.FC<Props> = ({ pb }) => {
  const { translation, activePlan } = useCurrentUser();
  const navigation = useNavigation();

  return (
    <>
      {!activePlan && (
        <Box
          px={3}
          pb={pb ? pb : 3.5}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            height: '100vh',
            width: '100%',
            background:
              'linear-gradient(0deg, rgba(33,79,75,1) 0%, rgba(33,79,75,1) 20%, rgba(33,79,75,0.49763655462184875) 100%)',
            flex: 1,
            alignContent: 'center',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <Headline
            center
            style={{ color: 'white' }}
            //   color="white"
          >
            Subscribe
          </Headline>
          <Paragraph
            center
            gutterBottom
            style={{ fontSize: 18, color: 'white' }}>
            {
              'Explore 100+ mindful practices from diverse teachers in english and spanish!'
            }
          </Paragraph>
          <Button
            // warning
            color="secondary"
            text={'Learn More'}
            onPress={() => navigation.navigate('/plans')}
          />
        </Box>
      )}
    </>
  );
};

export default LockOverlay;
