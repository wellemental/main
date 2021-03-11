import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon } from 'native-base';
import variables from '../assets/native-base-theme/variables/wellemental';
import { useNavigation } from '../hooks';

type Props = {
  inverse?: boolean;
  onPressBack?: () => void;
  float?: 'right' | 'left';
  close?: boolean;
};

const BackButton: React.FC<Props> = ({
  inverse,
  onPressBack,
  float,
  close,
  ...props
}) => {
  const navigation = useNavigation();
  const handleBack = onPressBack ? onPressBack : navigation.goBack;

  const floatStyle = float
    ? {
        position: 'absolute',
        top: 10,
        // left: float === 'left' ? 10 : undefined,
        right: float === 'right' ? 10 : undefined,
        zIndex: 10,
      }
    : {};

  return (
    <Button transparent onPress={handleBack} style={floatStyle}>
      <Icon
        name={close ? 'closecircleo' : 'chevron-left'}
        type={close ? 'AntDesign' : 'FontAwesome5'}
        style={StyleSheet.flatten([
          {
            color: inverse ? variables.white : variables.brandPrimary,
            fontSize: 28,
          },
          props.style,
        ])}
      />
    </Button>
  );
};

export default BackButton;
