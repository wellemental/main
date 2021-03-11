import React from 'react';
import { Icon as NbIcon, NativeBase } from 'native-base';

const Icon: React.FC<NativeBase.Icon> = ({ ...props }) => {
  return <NbIcon type={props.type ? props.type : 'Ionicons'} {...props} />;
};

export default Icon;
