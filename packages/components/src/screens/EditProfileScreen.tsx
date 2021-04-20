import { Form, Toast, Text, Button as NBButton, Segment } from 'native-base';
import React, { useState } from 'react';
import { UpdateUserService } from 'services';
import { Container, Error, Box, PageHeading, Button } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { UserProfile, Languages } from 'common';

import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width - 30;
const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

const EditProfileScreen: React.FC = () => {
  const { user, translation } = useCurrentUser();

  const [language, setLanguage] = useState(user.language);

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};

  if (language !== user.language) {
    newProfile.language = language;
  }

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(user.id, newProfile),
  );

  const handleUpdate = async () => {
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
      <PageHeading title={translation['Select language']} />
      <Form style={{ marginTop: 4 }}>
        <Segment style={{ marginTop: 15 }}>
          <NBButton
            first
            style={{
              width: deviceWidth / 2,
              justifyContent: 'center',
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            }}
            active={language === Languages.En}
            onPress={() => setLanguage(Languages.En)}>
            <Text>English</Text>
          </NBButton>

          <NBButton
            last
            style={{
              width: deviceWidth / 2,
              justifyContent: 'center',
              borderBottomRightRadius: 10,
              borderTopRightRadius: 10,
            }}
            active={language === Languages.Es}
            onPress={() => setLanguage(Languages.Es)}>
            <Text>Español</Text>
          </NBButton>
        </Segment>

        <Box mt={2}>
          <Button
            onPress={handleUpdate}
            loading={loading}
            disabled={!language}
            warning
            text={translation['Save Changes']}
          />
        </Box>
        <Error error={mutateError} />
      </Form>
    </Container>
  );
};

export default EditProfileScreen;
