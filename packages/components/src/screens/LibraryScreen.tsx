import React, { useState } from 'react';
import { Segment } from 'native-base';
import { Button, SearchBar, Content, Card } from '../primitives';
import { seed } from './seed';
import { Content as ContentType, Categories } from 'types';

const LibraryScreen: React.FC = () => {
  const [filter, setFilter] = useState<'All' | Categories>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // const filterOptions = ['Teachers', 'Age', 'Type', 'Length'];
  const filterOptions = ['All', 'Meditation', 'Movement'];

  // Filter data for Player Type and SearchTerm
  const data: ContentType[] = seed;
  let filteredData: ContentType[] | null = null;
  if (data) {
    filteredData = data
      .filter((item) =>
        filter === 'All'
          ? item
          : filter === Categories.Meditation
          ? item.category === Categories.Meditation
          : item.category === Categories.Movement,
      )
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }

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

      {filteredData.map((content) => (
        <Card content={content} />
      ))}
    </Content>
  );
};

export default LibraryScreen;
