import React, { ReactNode } from 'react';
import { Button as NBButton, Spinner, NativeBase, Text } from 'native-base';
import variables from '../../assets/native-base-theme/variables/wellemental';
import Icon from '../icons/Icon';
import { TextTranslate } from '../typography';

interface Props {
  loading?: boolean;
  text?: string;
  icon?: string;
}

const Button: React.FC<Props & NativeBase.Button> = ({
  loading = false,
  disabled = false,
  text,
  children,
  icon,
  full = false,
  ...props
}) => {
  let spinnerColor = variables.inverseSpinnerColor;
  if (props.light) {
    spinnerColor = variables.defaultSpinnerColor;
  }

  function renderChildren(): ReactNode {
    if (typeof children === 'string' || text || icon) {
      return (
        <>
          {icon && (
            <Icon
              icon={icon}
              style={{ paddingRight: 0, marginRight: !text ? 15 : -5 }}
            />
          )}
          {text && (
            <Text>
              <TextTranslate>{text}</TextTranslate>
            </Text>
          )}
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
