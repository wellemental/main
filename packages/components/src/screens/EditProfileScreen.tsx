import {
  Form,
  Item,
  Label,
  Toast,
  DatePicker,
  Text,
  Spinner,
  Button as NBButton,
  Segment,
} from 'native-base';
import React, { useState } from 'react';
import { Container, Error, Input, PageHeading, Button } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { UserProfile, UpdateUserService, Languages } from 'services';
import moment from 'moment';
import { Dimensions } from 'react-native';
import variables from '../assets/native-base-theme/variables/wellemental';

const deviceWidth = Dimensions.get('window').width - 30;

const EditProfileScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();
  const [name, setName] = useState(user.name);
  const [language, setLanguage] = useState(user.language);
  const [birthday, setBirthday] = useState(user.birthday);

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};
  if (name !== user.name) {
    newProfile.name = name;
  }

  if (birthday !== user.birthday) {
    newProfile.birthday = moment(birthday).format('YYYY-MM-DD');
  }

  if (language !== user.language) {
    newProfile.language = language;
  }

  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error, mutate } = useMutation(() =>
    service.updateProfile(user.id, newProfile),
  );

  return (
    <Container>
      <PageHeading title={translation['Edit Profile']} />
      <Form style={{ marginTop: 4 }}>
        <Input
          label={translation.Username}
          value={name}
          onChangeText={setName}
          disabled={loading}
        />

        <Label>{translation.Birthday}</Label>
        <DatePicker
          defaultDate={moment(birthday).toDate()}
          maximumDate={moment().toDate()}
          locale={'en'}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          placeHolderText={birthday ? birthday : translation['Select birthday']}
          textStyle={{ fontSize: 18, marginLeft: 0, paddingLeft: 0 }}
          placeHolderTextStyle={{ color: variables.textColor, paddingLeft: 0 }}
          onDateChange={setBirthday}
          disabled={false}
        />
        <Item style={{ marginLeft: 0, marginBottom: 25 }} />

        <Label>{translation.Language}</Label>
        <Segment style={{ marginTop: 15 }}>
          <NBButton
            first
            style={{ width: deviceWidth / 2, justifyContent: 'center' }}
            active={language === Languages.En}
            onPress={() => setLanguage(Languages.En)}>
            <Text>English</Text>
          </NBButton>

          <NBButton
            last
            style={{ width: deviceWidth / 2, justifyContent: 'center' }}
            active={language === Languages.Es}
            onPress={() => setLanguage(Languages.Es)}>
            <Text>Español</Text>
          </NBButton>
        </Segment>

        <Button
          padder="top"
          large
          onPress={(): void => {
            mutate(
              () =>
                Toast.show({
                  text: translation['Changes Saved'],
                  style: { marginBottom: 20 },
                }),
              () =>
                Toast.show({
                  text: translation['Something went wrong'],
                  style: { marginBottom: 20 },
                }),
            );
          }}
          loading={loading}
          danger
          text={translation['Save Changes']}
        />
        <Error error={error} />
      </Form>
    </Container>
  );
};

export default EditProfileScreen;
