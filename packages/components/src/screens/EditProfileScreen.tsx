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
  Box,
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
  const { auth, user, translation, updateUser } = useCurrentUser();
  const [name, setName] = useState(user.name);
  const [language, setLanguage] = useState(user.language);
  const [birthday, setBirthday] = useState(user.birthday);
  const [error, setError] = useState('');

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

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(auth.uid, newProfile),
  );

  const handleUpdate = async () => {
    try {
      await updateUser(newProfile);
    } catch (err) {
      setError(err);
    }

    console.log('NEW PROFILE', newProfile);

    mutate(
      () =>
        Toast.show({
          text: translation['Changes saved'], //translation['Changes saved'],
          style: { marginBottom: 20 },
        }),
      () =>
        Toast.show({
          text: translation['Error. Please try again.'], //translation['Something went wrong'],
          style: { marginBottom: 20 },
        }),
    );
  };

  return (
    <Container scrollEnabled>
      <PageHeading title={translation['Edit Profile']} />
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

        <Box gt={2}>
          <Button
            onPress={handleUpdate}
            loading={loading}
            disabled={!name || !language || !birthday}
            danger
            text={translation['Save Changes']}
          />
        </Box>
        <Error error={error || mutateError} />
      </Form>
    </Container>
  );
};

export default EditProfileScreen;
