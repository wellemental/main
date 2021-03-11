import React, { SetStateAction } from 'react';
import Button from './Button';
import Box, { BoxProps } from './Box';
import variables from '../assets/native-base-theme/variables/wellemental';
import { Tab } from 'common';
import { useCurrentUser } from '../hooks';

interface Props {
  active: string;
  setState: SetStateAction<any>;
  tabs: Tab[];
  small?: boolean;
  center?: boolean;
  full?: boolean;
}

const TabsButtons: React.FC<Props> = ({
  tabs,
  active,
  setState,
  small,
  center,
  full,
  ...props
}) => {
  const { translation } = useCurrentUser();
  return (
    <Box row center={center} {...props}>
      {tabs.map((tab) => {
        const isActive = tab.label === active;
        const label = translation[tab.label]
          ? translation[tab.label]
          : tab.label;
        return (
          <Button
            key={tab.label}
            text={label}
            iconName={tab.icon ? tab.icon : undefined}
            small={small}
            style={{
              flex: full ? 1 : undefined,
              borderBottomColor: isActive
                ? variables.brandPrimary
                : 'rgba(0,0,0,0)',
              borderBottomWidth: 3,
              borderRadius: 0,
            }}
            transparent
            onPress={(): void => setState(tab.label)}
          />
        );
      })}
    </Box>
  );
};

export default TabsButtons;
