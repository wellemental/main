import React, { useState } from 'react';
import { Container, PageHeading, SearchBar, ContentLoop } from '../primitives';
import { useCurrentUser } from '../hooks';

const SearchScreen: React.FC = () => {
  const { translation } = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container>
      <ContentLoop
        search={searchTerm}
        header={
          <>
            <PageHeading title={translation.Search} />
            <SearchBar value={searchTerm} setState={setSearchTerm} />
          </>
        }
      />
    </Container>
  );
};

export default SearchScreen;
