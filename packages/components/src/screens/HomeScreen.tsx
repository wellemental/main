import React from 'react';
import { View, Text } from 'react-native';
// import { Button } from 'native-base';
import { Button } from '../primitives';
// import getTheme from '../assets/native-base-theme/components';
// import material from '../assets/native-base-theme/variables/material';
// import { Button } from 'react-native-elements';
const HomeScreen: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Monorepo!</Text>
      <Button text="Solid Button" />
      {/* <Button>
        <Text>Testing Native B</Text>
      </Button> */}
    </View>
  );
};

export default HomeScreen;
