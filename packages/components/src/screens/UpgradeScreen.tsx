import React from 'react';
import { Linking, Platform } from 'react-native';
import { Box, Container, Button, Paragraph, Headline } from '../primitives';
import { useCurrentUser } from '../hooks';
import { appStoreUrl } from 'common';
import { UpgradeScreenNavigationProp, UpgradeScreenRouteProp } from '../types';

type Props = {
  route: UpgradeScreenRouteProp;
  navigation: UpgradeScreenNavigationProp;
};

const UpgradeScreen: React.FC<Props> = ({ route }) => {
  const { translation } = useCurrentUser();

  const upgradeOnPress = (): void => {
    Linking.openURL(appStoreUrl[Platform.OS]).catch(err =>
      console.error('An error occurred', err),
    );
  };

  return (
    <Container center>
      <Box mb={1}>
        <Headline
          center>{`${translation['Upgrade App']} ${translation.Required}!`}</Headline>
      </Box>
      <Box mb={2}>
        <Paragraph center>
          Tap to download the latest Wellemental update.
        </Paragraph>
      </Box>
      <Button
        text={translation.Download}
        iconType="Ionicons"
        iconName="download"
        onPress={upgradeOnPress}
      />
    </Container>
  );
};

export default UpgradeScreen;
