import React from 'react';
import { Dimensions } from 'react-native';
import Headline from './Headline';
import { Card, CardItem } from 'native-base';
import { Teacher } from 'services';
import Image from './Image';
import { useNavigation } from '@react-navigation/native';

interface Props {
  teacher: Teacher;
}

const deviceWidth = Dimensions.get('window').width * 0.45;

const TeacherCard: React.FC<Props> = ({ teacher }) => {
  const navigation = useNavigation();
  return (
    <Card transparent>
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
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
        <Image
          style={{ height: deviceWidth, width: deviceWidth, borderRadius: 100 }}
          source={{ uri: teacher.photo }}
        />
        <Headline center small>
          {teacher.name}
        </Headline>
      </CardItem>
    </Card>
  );
};

export default TeacherCard;
