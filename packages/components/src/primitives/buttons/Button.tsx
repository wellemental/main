import React, { ReactNode } from 'react';
import {
  Button as NBButton,
  Icon,
  Spinner,
  NativeBase,
  Text,
} from 'native-base';
import variables from '../../assets/native-base-theme/variables/wellemental';

interface Props {
  loading?: boolean;
  text?: string;
  iconName?: string;
  iconType?:
    | 'FontAwesome5'
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialCommunityIcons'
    | 'MaterialIcons'
    | 'Octicons'
    | 'SimpleLineIcons'
    | 'Zocial';
}

const Button: React.FC<Props & NativeBase.Button> = ({
  loading = false,
  disabled = false,
  text,
  children,
  iconName,
  iconType,
  full = false,
  ...props
}) => {
  let spinnerColor = variables.inverseSpinnerColor;
  if (props.light) {
    spinnerColor = variables.defaultSpinnerColor;
  }

  function renderChildren(): ReactNode {
    if (typeof children === 'string' || text || iconName) {
      return (
        <>
          {iconName && (
            <Icon
              type={iconType ? iconType : 'Ionicons'}
              name={iconName}
              style={{ paddingRight: 0, marginRight: -5 }}
            />
          )}
          {text && <Text>{text}</Text>}
        </>
      );
    } else {
      return children;
    }
  }

  return (
    <NBButton
      block={full ? false : true}
      disabled={loading || disabled}
      full={full}
      {...props}>
      {loading ? <Spinner size={14} color={spinnerColor} /> : renderChildren()}
    </NBButton>
  );
};

export default Button;
