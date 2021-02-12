import React from 'react';
import { Linking, Platform } from 'react-native';
import { Box, Container, Button, Paragraph, Headline } from '../primitives';
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
    Linking.openURL(
      Platform.OS === 'android' ? version.androidUrl : version.iosUrl,
    ).catch((err) => console.error('An error occurred', err));
  };

  return (
    <Container center>
      <Box mb={1}>
        <Headline
          center>{`${translation['Upgrade App']} ${translation.Required}!`}</Headline>
      </Box>
      <Box mb={2}>
        <Paragraph center>
          {translation['Tap below to download the latest Wellemental update.']}
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
