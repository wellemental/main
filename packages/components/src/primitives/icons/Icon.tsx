import React from 'react';
import { Icon as NbIcon, NativeBase } from 'native-base';

const Icon: React.FC<NativeBase.Icon> = ({ ...props }) => {
  return <NbIcon type={props.type ? 'Feather' : 'Ionicons'} {...props} />;
};

export default Icon;
