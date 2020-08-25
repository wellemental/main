import React, { ReactNode } from 'react';
import { StyleSheet, StyleProp, TextStyle, Text } from 'react-native';
import { Button as NBButton, Icon, Spinner, NativeBase } from 'native-base';
// import Text from './Text';
import styled from 'styled-components';
import variables from '../assets/native-base-theme/variables/wellemental';

interface Props {
  loading?: boolean;
  text?: string;
  iconName?: string;
  iconType?: string;
  padder?: 'top' | 'bottom' | 'vertical';
  textStyle?: StyleProp<TextStyle>;
}

const ButtonText = styled(Text)`
  text-align: center;
  font-weight: 500;
  color: white;
  font-size: 18px;
`;

const Button: React.FC<Props & NativeBase.Button> = ({
  loading = false,
  disabled = false,
  textStyle,
  text,
  children,
  iconName,
  iconType,
  padder,
  ...props
}) => {
  const { style } = props;
  const spacing = variables.contentPadding * 2;

  let marginStyle = {};
  switch (padder) {
    case 'top': {
      marginStyle = { marginTop: spacing };
      break;
    }
    case 'bottom': {
      marginStyle = { marginBottom: spacing };
      break;
    }
    case 'vertical': {
      marginStyle = { marginTop: spacing, marginBottom: spacing };
      break;
    }
  }

  const { primary, light, info, full } = props;

  let spinnerColor = variables.inverseSpinnerColor;
  if (light) {
    spinnerColor = variables.defaultSpinnerColor;
  }

  function renderChildren(): ReactNode {
    if (typeof children === 'string' || text || iconName) {
      return (
        <>
          {iconName && (
            <Icon
              type={iconType ? iconType : 'FontAwesome5'}
              name={iconName}
              style={{ paddingRight: 0, marginRight: -5 }}
            />
          )}
          {text && (
            <ButtonText style={textStyle}>
              {children ? children : text}
            </ButtonText>
          )}
        </>
      );
    } else {
      return children;
    }
  }
  return (
    // <GradientButton
    //   colors={[variables.brandPrimary, variables.brandPrimaryDark]}>
    <NBButton
      block={full ? false : true}
      disabled={loading || disabled}
      full={full}
      style={StyleSheet.flatten([marginStyle, style])}
      {...props}>
      {loading ? <Spinner size={14} color={spinnerColor} /> : renderChildren()}
    </NBButton>
    // </GradientButton>
  );
};

export default Button;
