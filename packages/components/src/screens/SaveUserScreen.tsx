import React, { useState, useEffect } from 'react';
import Spinner from '../primitives/Spinner';
import {
  LocalStateService,
  ApplicationError,
  UpdateUserService,
  Logger,
  InitialUserDoc,
} from 'services';
import EditProfileScreen from './EditProfileScreen';
import { Container, Error } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { English, getTranslation } from 'services';

const SaveUserScreen: React.FC = () => {
  const { auth } = useCurrentUser();
  let translation = English;

  const [gettingStorage, setIsGetting] = useState(true);
  const [asyncError, setAsyncError] = useState<ApplicationError>();

  const savedData: InitialUserDoc = {
    id: auth.uid,
    email: auth.email,
    name: '',
    birthday: '',
    language: '',
  };

  const service = new LocalStateService();
  const service2 = new UpdateUserService();
  const { mutate, error, loading } = useMutation(() =>
    service2.createProfile(savedData),
  );
  const getData = async (): Promise<void> => {
    try {
      // Pull extra signup data from Async storage
      savedData.language = await service.getStorage('wmLanguage');
      translation = getTranslation(savedData.language);
      savedData.birthday = await service.getStorage('wmBirthday');
      savedData.name = await service.getStorage('wmName');

      // Delete the data from storage, keep language for quick app loading
      service.removeStorage('wmBirthday');
      service.removeStorage('wmName');

      // Save info to database
      mutate();
    } catch (err) {
      setIsGetting(false);
      setAsyncError(
        new ApplicationError(translation['Error creating profile. Try again.']),
      );
      Logger.error(`Failed to get data from async storage: ${err}`);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return gettingStorage || loading ? (
    <Spinner text={translation['Creating account...']} />
  ) : (
    <Container center>
      <EditProfileScreen requiredPrompt />
      {error && <Error error={error} />}
      {asyncError && <Error error={asyncError} />}
    </Container>
  );
};

export default SaveUserScreen;
