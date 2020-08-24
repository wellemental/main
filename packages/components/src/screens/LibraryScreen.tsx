import React, { useState, useRef } from 'react';
import { Segment } from 'native-base';
import {
  Button,
  SearchBar,
  Container,
  Card,
  Spinner,
  Paragraph,
} from '../primitives';
import {
  Content as ContentType,
  Categories,
  ContentService,
  TeacherService,
  Teacher,
} from 'services';
import { useQuery } from '../hooks';

const LibraryScreen: React.FC = () => {
  const [filter, setFilter] = useState<'All' | Categories>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterOptions = ['All'].concat(Object.values(Categories));
  const service = new ContentService(); //container.getInstance<SurveysService>('surveysService',);
  const query = useRef(service.getAllContent); // useRef(() => surveysService.getAnswersForSurvey(user.id));
  const { loading, data } = useQuery(query.current);

  const service2 = new TeacherService();
  const query2 = useRef(service2.getAllTeachers);
  const { loading: teacherLoading, data: teachers } = useQuery(query2.current);

  let filteredData: ContentType[] | null = null;

  if (data) {
    filteredData = data
      .filter((item) => (filter === 'All' ? item : item.type === filter))
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
  }

  return loading || teacherLoading ? (
    <Spinner />
  ) : (
    <Container>
      <SearchBar value={searchTerm} setState={setSearchTerm} />

      <Segment>
        {filterOptions.map((option, idx) => (
          <Button
            text={option}
            key={idx}
            first={idx === 0}
            last={idx + 1 === filterOptions.length}
            onPress={(): void => setFilter(option)}
            active={filter === option}
          />
        ))}
      </Segment>

      {filteredData ? (
        filteredData.map((content, idx) => (
          <Card
            key={idx}
            content={content}
            teacher={teachers[content.teacher]}
          />
        ))
      ) : (
        <Paragraph>Nothin</Paragraph>
      )}
    </Container>
  );
};

export default LibraryScreen;
