import { Form, Toast, Text, Button as NBButton, Segment } from 'native-base';
import React, { useState } from 'react';
import Error from './Error';
import Box from './Box';
import Button from './Button';
import { useCurrentUser, useMutation } from '../hooks';
import { UserProfile, UpdateUserService, Languages } from 'services';

import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('window').width - 30;

const EditProfileScreen: React.FC = () => {
  const { auth, user, translation } = useCurrentUser();

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};

  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(auth.uid, newProfile),
  );

  const handleUpdate = async (newLanguage: Languages) => {
    if (newLanguage !== user.language) {
      newProfile.language = newLanguage;
    }
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
          active={user && user.language === Languages.En}
          disabled={loading}
          onPress={() => handleUpdate(Languages.En)}>
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
          active={user && user.language === Languages.Es}
          disabled={loading}
          onPress={() => handleUpdate(Languages.Es)}>
          <Text>Español</Text>
        </NBButton>
      </Segment>
      <Error error={mutateError} />
    </Form>
  );
};

export default EditProfileScreen;
