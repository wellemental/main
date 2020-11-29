import React, { useState } from 'react';
import { PageHeading, SearchBar, ContentLoop } from '../primitives';
import { useCurrentUser } from '../hooks';

const SearchScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <PageHeading title={translation.Search} />
      <SearchBar value={searchTerm} setState={setSearchTerm} />
      <ContentLoop search={searchTerm} />
    </>
  );
};

export default SearchScreen;
