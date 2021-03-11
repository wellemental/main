import React from 'react';
import Headline from './Headline';
import Button from './Button';
import Paragraph from './Paragraph';
import Box from './Box';
import { deviceHeight, deviceWidth } from 'services';
import { useCurrentUser, useNavigation } from '../hooks';

const LockOverlay: React.FC = () => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();

  return (
    <Box
      style={{
        position: 'absolute',
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        backgroundColor: 'rgba(33, 79,75, 0.90)',
      }}>
      <Box
        px={3}
        pb={2.5}
        style={{
          position: 'absolute',
          bottom: 100,
          width: deviceWidth,
        }}>
        <Headline center color="white">
          {translation.Subscribe}
        </Headline>
        <Paragraph center color="white" gb={1}>
          {translation['100+ meditation and yoga videos and more']}
        </Paragraph>
        <Button
          light
          text={translation['Learn More']}
          onPress={() => navigation.navigate('Plans')}
        />
      </Box>
    </Box>
  );
};

export default LockOverlay;
