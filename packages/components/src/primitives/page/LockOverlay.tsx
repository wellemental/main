import React from 'react';
import Headline from '../typography/Headline';
import Button from '../buttons/Button';
import Paragraph from '../typography/Paragraph';
import Box from '../utils/Box';
import { deviceHeight, deviceWidth } from 'services';
import { useCurrentUser, useNavigation } from '../../hooks';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  pb?: number;
};
const LockOverlay: React.FC<Props> = ({ pb }) => {
  const { translation, activePlan } = useCurrentUser();
  const navigation = useNavigation();

  const insets = useSafeAreaInsets();

  return (
    <>
      {!activePlan && (
        <LinearGradient
          colors={['rgba(33,79,75,.5)', 'rgba(33,79,75,1)']}
          locations={[0, 0.75]}
          style={{
            position: 'absolute',
            flex: 1,
            width: deviceWidth,
            height: deviceHeight,
          }}>
          <Box
            px={3}
            pb={pb ? pb : 3.5}
            style={{
              position: 'absolute',
              bottom: 60 + insets.bottom,
              width: deviceWidth,
              flex: 1,
            }}>
            <Headline center color="white">
              {translation.Subscribe}
            </Headline>
            <Paragraph
              center
              color="white"
              gt={0.5}
              gb={1.5}
              style={{ fontSize: 18 }}>
              {
                translation[
                  'Explore 100+ mindful practices from diverse teachers in english and spanish!'
                ]
              }
            </Paragraph>
            <Button
              warning
              text={translation['Learn More']}
              onPress={() => navigation.navigate('Plans')}
            />
          </Box>
        </LinearGradient>
        //</ImageBackground>
      )}
    </>
  );
};

export default LockOverlay;
