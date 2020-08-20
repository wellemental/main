import React, { useState } from 'react';
import { Text } from 'react-native';
import { Segment } from 'native-base';
import { Button, SearchBar, Content, Card } from '../primitives';
import { seed } from './seed';

const LibraryScreen: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'New' | 'Lapsed'>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // let filteredData: TeamPlayer[] | null = null;

  const filterOptions = ['Teachers', 'Age', 'Type', 'Length'];

  return (
    <Content>
      <SearchBar value={searchTerm} setState={setSearchTerm} />

      <Segment>
        {filterOptions.map((option, idx) => (
          <Button
            text={option}
            first={idx === 0}
            last={idx + 1 === filterOptions.length}
            onPress={(): void => setFilter(option)}
            active={filter === option}
          />
        ))}
      </Segment>

      {seed.map((content) => (
        <Card content={content} />
      ))}
    </Content>
  );
};

export default LibraryScreen;
