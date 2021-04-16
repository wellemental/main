import React, { useState } from 'react';
import { Container, PageHeading, SearchBar, ContentLoop } from '../primitives';

const SearchScreen: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container noPadding="vertical">
      <ContentLoop
        scrollEnabled
        search={searchTerm}
        header={
          <>
            <PageHeading title="Search" />
            <SearchBar value={searchTerm} setState={setSearchTerm} />
          </>
        }
      />
    </Container>
  );
};

export default SearchScreen;
