import React, { SetStateAction } from 'react';
import Button from './Button';
import Box from '../utils/Box';
import variables from '../../assets/native-base-theme/variables/wellemental';
import { Colors, Tab } from 'common';
import { useCurrentUser } from '../../hooks';

interface Props {
  active: string;
  setState: SetStateAction<any>;
  tabs: Tab[];
  small?: boolean;
  center?: boolean;
  full?: boolean;
  color?: Colors;
  iconsOnly?: boolean;
}

const TabsButtons: React.FC<Props> = ({
  tabs,
  active,
  setState,
  small,
  center,
  color,
  full,
  iconsOnly,
  ...props
}) => {
  const { translation } = useCurrentUser();

  const activeColor = color ? variables[color] : variables.brandPrimary;

  return (
    <Box row center={center} {...props}>
      {tabs.map(tab => {
        const isActive = tab.label === active;
        const label = translation[tab.label]
          ? translation[tab.label]
          : tab.label;
        return (
          <Button
            key={tab.label}
            text={iconsOnly ? undefined : label}
            icon={tab.icon ? tab.icon : undefined}
            small={small}
            style={{
              flex: full ? 1 : undefined,
              borderBottomColor: isActive ? activeColor : 'rgba(0,0,0,0)',
              borderBottomWidth: 3,
              borderRadius: 0,
              backgroundColor: 'rgba(0,0,0,0',
            }}
            transparent={color === 'white' ? false : true}
            onPress={(): void => setState(tab.label)}
          />
        );
      })}
    </Box>
  );
};

export default TabsButtons;
