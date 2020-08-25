import React from 'react';
import Paragraph from './Paragraph';
import { Card, CardItem, Thumbnail } from 'native-base';
import { Teacher } from 'services';
import { useNavigation } from '@react-navigation/native';

interface Props {
  teacher: Teacher;
}

const TeacherCard: React.FC<Props> = ({ teacher }) => {
  const navigation = useNavigation();
  return (
    <Card transparent style={{ width: '40%' }}>
      <CardItem
        cardBody
        button
        onPress={() =>
          navigation.navigate('Teacher', {
            teacher,
          })
        }
        style={{
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Thumbnail
          style={{ height: 200, width: 200, borderRadius: 100 }}
          source={{ uri: teacher.photo }}
        />
        <Paragraph style={{ marginTop: 20, fontSize: 18 }}>
          {teacher.name}
        </Paragraph>
      </CardItem>
    </Card>
  );
};

export default TeacherCard;
