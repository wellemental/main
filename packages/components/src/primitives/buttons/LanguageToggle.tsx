import React from 'react';
import { Form, Toast, Text, Button as NBButton, Segment } from 'native-base';
import Error from '../typography/Error';
import { useCurrentUser, useMutation } from '../../hooks';
import { UpdateUserService } from 'services';
import { UserProfile, Languages } from 'common';
import { Dimensions } from 'react-native';
import { colors } from 'common';

const deviceWidth = Dimensions.get('window').width - 30;

const LanguageToggle: React.FC = () => {
  const { user, translation } = useCurrentUser();

  // Only submit what's changed upon saving
  const newProfile: UserProfile = {};

  const service = new UpdateUserService(); //container.getInstance<ProfileService>('profileService');

  const { loading, error: mutateError, mutate } = useMutation(() =>
    service.updateProfile(user.id, newProfile),
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
          primary={user && user.language === Languages.En}
          active={user && user.language === Languages.En}
          disabled={loading}
          onPress={() => handleUpdate(Languages.En)}>
          <Text
            style={{
              color:
                user && user.language === Languages.En
                  ? colors.white
                  : colors.primary,
            }}>
            English
          </Text>
        </NBButton>

        <NBButton
          last
          style={{
            width: deviceWidth / 2,
            justifyContent: 'center',
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
          }}
          primary={user && user.language === Languages.Es}
          active={user && user.language === Languages.Es}
          disabled={loading}
          onPress={() => handleUpdate(Languages.Es)}>
          <Text
            style={{
              color:
                user && user.language === Languages.Es
                  ? colors.white
                  : colors.primary,
            }}>
            Español
          </Text>
        </NBButton>
      </Segment>
      <Error error={mutateError} />
    </Form>
  );
};

export default LanguageToggle;
