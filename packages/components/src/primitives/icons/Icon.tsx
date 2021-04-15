import React from 'react';
import { Icon as NbIcon, NativeBase } from 'native-base';
import { Icon as IconType } from 'common';

export type Icons =
  | 'favorite'
  | 'history'
  | 'stats'
  | 'settings'
  | 'lock'
  | 'play'
  | 'focus'
  | 'stress'
  | 'energize'
  | 'philosophy'
  | 'classes'
  | 'breaks'
  | 'new'
  | 'rest'
  | 'clock'
  | 'teach'
  | 'school'
  | 'search';

const icons: { [key in Icons]: IconType } = {
  favorite: { type: 'Ionicons', active: 'heart', inactive: 'heart-outline' },
  history: {
    type: 'MaterialCommunityIcons',
    inactive: 'history',
  },
  stats: { type: 'Feather', inactive: 'bar-chart' },
  settings: { type: 'FontAwesome5', inactive: 'cog' },
  lock: { type: 'Ionicons', inactive: 'lock-closed' },
  play: { type: 'Ionicons', inactive: 'play' },
  focus: {
    type: 'Feather',
    inactive: 'target',
  },
  stress: { type: 'FontAwesome5', inactive: 'meh' },
  energize: { type: 'Ionicons', inactive: 'trending-up' },
  rest: { type: 'Ionicons', inactive: 'trending-down' },
  philosophy: { type: 'Feather', inactive: 'book-open' },
  classes: { type: 'MaterialCommunityIcons', inactive: 'teach' },
  clock: { type: 'Feather', inactive: 'clock' },
  teach: { type: 'Ionicons', inactive: 'school' },
  school: { type: 'Ionicons', inactive: 'school' },
  search: { type: 'Ionicons', inactive: 'search' },
};

type Props = {
  icon?: Icons;
  active?: boolean;
};

const Icon: React.FC<Props & NativeBase.Icon> = ({
  active,
  icon,
  ...props
}) => {
  // Get corresponding icon from icons list
  const theIcon = icons[icon];

  // If icon object has active version, use that, if not use inactive
  // Settings backups to safeguard against legacy Icon code that didn't use the above icon object
  // The featured categories in particular since those can be updated by admins, we can't store all icons in the object above to cover
  const isActive = theIcon && active && theIcon.active ? 'active' : 'inactive';
  const name = theIcon ? theIcon[isActive] : props.name;

  const type =
    theIcon && theIcon.type
      ? theIcon.type
      : props.type
      ? props.type
      : 'Ionicons';

  return <NbIcon type={type} name={name} {...props} />;
};

export default Icon;
