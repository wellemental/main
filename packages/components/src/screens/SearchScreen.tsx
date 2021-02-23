import React, { useState } from 'react';
import { Container, PageHeading, SearchBar, ContentLoop } from '../primitives';
import { useCurrentUser } from '../hooks';

const SearchScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container scrollEnabled>
      <PageHeading noHeader title={translation.Search} />
      <SearchBar value={searchTerm} setState={setSearchTerm} />
      <ContentLoop search={searchTerm} />
    </Container>
  );
};

export default SearchScreen;
