import React, { useState } from 'react';
import { Container, PageHeading, SearchBar, ContentLoop } from '../primitives';

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container>
      <PageHeading title="Search" />
      <SearchBar value={searchTerm} setState={setSearchTerm} />
      <ContentLoop search={searchTerm} />
    </Container>
  );
};

export default SearchScreen;
