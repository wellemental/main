import React, { useEffect, useState } from 'react';
import { ImageBackground, View, LayoutAnimation } from 'react-native';
import Headline from './Headline';
import Button from './Button';
import Paragraph from './Paragraph';
import Box from './Box';
import { deviceHeight, deviceWidth } from 'services';
import { useCurrentUser, useNavigation } from '../hooks';

const LockOverlay: React.FC = () => {
  const navigation = useNavigation();
  const { translation } = useCurrentUser();
  const [show, toggleShow] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleShow(true);
  }, []);

  return (
    <>
      {show && (
        <ImageBackground
          source={require('../assets/images/wm_bg_lock_9.png')}
          style={{
            position: 'absolute',
            flex: 1,
            width: deviceWidth,
            height: deviceHeight,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <Box
              px={3}
              pb={1.5}
              style={{
                position: 'absolute',
                bottom: 105,
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
          </View>
        </ImageBackground>
      )}
    </>
  );
};

export default LockOverlay;
