import React from 'react';
import MuiAvatar, { AvatarProps } from '@material-ui/core/Avatar';

type Props = {
  source: string;
  size?: number;
  mb?: number;
};

const Avatar: React.FC<Props & AvatarProps> = ({
  source,
  size,
  mb,
  ...props
}) => {
  return (
    <MuiAvatar
      style={{
        height: size ? size : 40,
        width: size ? size : 40,
        borderRadius: 100,
        marginBottom: mb ? mb : 0,
      }}
      src={source}
      {...props}
    />
  );
};

export default Avatar;
