import React from 'react';
import { Item, Icon, Input } from 'native-base';
import Button from '../buttons/Button';

type Props = {
  value: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar: React.FC<Props> = ({ value, setState }) => {
  return (
    <>
      <Item
        style={{
          flexDirection: 'row',
          marginBottom: 15,
        }}>
        <Icon name="ios-search" />
        <Input value={value} onChangeText={setState} />
        {!!value && (
          <Button
            transparent
            iconRight
            iconName="close"
            iconType="Ionicons"
            onPress={() => setState('')}
          />
        )}
      </Item>
    </>
  );
};

export default SearchBar;
