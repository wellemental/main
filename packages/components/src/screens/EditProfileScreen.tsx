import {
  Form,
  Label,
  Toast,
  Text,
  Button as NBButton,
  Segment,
} from 'native-base';
import React, { useState } from 'react';
import {
  Container,
  Error,
  Input,
  PageHeading,
  Button,
  DatePicker,
} from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { UserProfile, UpdateUserService, Languages } from 'services';
import moment from 'moment';
import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width - 30;

type Props = {
  requiredPrompt: boolean;
};

const EditProfileScreen: React.FC<Props> = ({ requiredPrompt }) => {
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
      <PageHeading
        title={translation['Edit Profile']}
        subtitle={
          requiredPrompt
            ? translation[
                'Your profile is missing required information. Please update it below.'
              ]
            : ''
        }
      />
      <Form style={{ marginTop: 4 }}>
        <Input
          label={translation.Username}
          value={name}
          onChangeText={setName}
          disabled={loading}
        />

        <DatePicker
          date={moment(birthday).toDate()}
          translation={translation}
          onDateChange={setBirthday}
          locale={user.language === Languages.Es ? 'es' : 'en'}
        />

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
                  text: 'Changes saved', //translation['Changes saved'],
                  style: { marginBottom: 20 },
                }),
              () =>
                Toast.show({
                  text: 'Something went wrong', //translation['Something went wrong'],
                  style: { marginBottom: 20 },
                }),
            );
          }}
          loading={loading}
          disabled={!name || !language || !birthday}
          danger
          text={translation['Save Changes']}
        />
        <Error error={error} />
      </Form>
    </Container>
  );
};

export default EditProfileScreen;
