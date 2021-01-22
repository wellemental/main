import React from 'react';
import { Linking } from 'react-native';
import { Box, Container, Button, Paragraph } from '../primitives';
import { H1 } from 'native-base';
import { useCurrentUser } from '../hooks';
import { UpgradeScreenNavigationProp, UpgradeScreenRouteProp } from '../types';

type Props = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const UpgradeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { version } = route.params;
  const { translation } = useCurrentUser();

  const upgradeOnPress = (): void => {
    Linking.openURL(version.iosUrl).catch((err) =>
      console.error('An error occurred', err),
    );
  };

  return (
    <Container center>
      <Box mb={0.5}>
        <H1>{`${translation['Upgrade App']} ${translation.Required}!`}</H1>
      </Box>
      <Box mb={1.5}>
        <Paragraph>
          {translation['Tap below to download the latest Wellemental update.']}
        </Paragraph>
      </Box>
      <Button
        text={translation.Download}
        iconName="download"
        onPress={upgradeOnPress}
      />
      {!version.forceUpgrade && (
        <Box mt={1}>
          <Button
            text={translation['No Thanks']}
            transparent
            onPress={(): void => navigation.goBack()}
          />
        </Box>
      )}
    </Container>
  );
};

export default UpgradeScreen;
