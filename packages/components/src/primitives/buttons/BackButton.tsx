import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Button, Icon } from 'native-base';
import variables from '../../assets/native-base-theme/variables/wellemental';
import { useNavigation } from '../../hooks';

type Props = {
  inverse?: boolean;
  onPressBack?: () => void;
  float?: 'right' | 'left';
  close?: boolean;
  plansScreen?: boolean; // fix for Android view
};

const BackButton: React.FC<Props> = ({
  inverse,
  onPressBack,
  plansScreen,
  float,
  close,
  ...props
}) => {
  const navigation = useNavigation();
  const handleBack = onPressBack ? onPressBack : navigation.goBack;

  const floatStyle = float
    ? {
        position: 'absolute',
        top: Platform.OS === 'android' && plansScreen ? 45 : 0,
        left: float === 'left' ? 0 : undefined,
        right: float === 'right' ? 0 : undefined,
        zIndex: 10,
      }
    : {};

  return (
    <Button transparent onPress={handleBack} style={floatStyle}>
      <Icon
        name={close ? 'times-circle' : 'chevron-down'}
        type={close ? 'FontAwesome5' : 'FontAwesome5'}
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
