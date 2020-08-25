import { Form, Item, Label, Toast, DatePicker } from 'native-base';
import React, { useState } from 'react';
import { Button, Container, Error, Input, PageHeading } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { UserProfile, UpdateUserService } from 'services';
import moment from 'moment';

const EditProfileScreen: React.FC = () => {
  const { user } = useCurrentUser();
  const [name, setName] = useState(user.name);
  const [birthday, setBirthday] = useState(user.birthday);

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};
  if (name !== user.name) {
    newProfile.name = name;
  }

  if (birthday !== user.birthday) {
    newProfile.birthday = birthday;
  }

  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error, mutate } = useMutation(() =>
    service.updateProfile(user.id, newProfile),
  );

  return (
    <Container>
      <PageHeading title="Edit Profile" />
      <Form style={{ marginTop: 4 }}>
        <Input
          label="Username"
          value={name}
          onChangeText={setName}
          disabled={loading}
        />

        <Label>Birthday</Label>
        <DatePicker
          defaultDate={birthday}
          maximumDate={moment().toDate()}
          locale={'es'}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          placeHolderText="Select birthday"
          textStyle={{ fontSize: 18, marginLeft: 0, paddingLeft: 0 }}
          placeHolderTextStyle={{ color: '#999', paddingLeft: 0 }}
          onDateChange={setBirthday}
          disabled={false}
        />
        <Item style={{ marginLeft: 0 }}></Item>

        <Button
          padder="top"
          large
          onPress={(): void => {
            mutate(
              () =>
                Toast.show({
                  text: 'Changes saved',
                  style: { marginBottom: 20 },
                }),
              () =>
                Toast.show({
                  text: 'Something went wrong',
                  style: { marginBottom: 20 },
                }),
            );
          }}
          loading={loading}
          danger
          text="Save Changes"
        />
        <Error error={error} />
      </Form>
    </Container>
  );
};

export default EditProfileScreen;
