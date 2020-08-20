import React from 'react';
import {
  Container,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
} from 'native-base';

type Props = {
  value: string;
  setState: () => void;
};

const SearchBar: React.FC = ({ value, setState }) => {
  return (
    <Header searchBar rounded>
      <Item>
        <Icon name="ios-search" />
        <Input
          placeholder="Search"
          value={value}
          onChangeText={(e): void => setState(e)}
        />
        <Icon name="ios-people" />
      </Item>
      <Button transparent>
        <Text>Search</Text>
      </Button>
    </Header>
  );
};

export default SearchBar;
