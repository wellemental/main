import React, { useState } from 'react';
import { PageHeading, SearchBar, ContentLoop, Box } from '../primitives';
import { useCurrentUser } from '../hooks';

// Eventually need to add Trie search
const SearchScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <PageHeading title={translation.Search} />
      <Box mb={2}>
        <SearchBar value={searchTerm} setState={setSearchTerm} />
      </Box>
      <ContentLoop search={searchTerm} />
    </>
  );
};

export default SearchScreen;
