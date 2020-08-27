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
import { Error } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { getTranslation } from '../translations';
import { English } from '../translations/en';

const SaveUserScreen: React.FC = () => {
  const { auth } = useCurrentUser();
  let translation = English;

  const [gettingStorage, setIsGetting] = useState(true);
  const [asyncError, setAsyncError] = useState<ApplicationError>();

  const savedData: Partial<InitialUserDoc> = {
    id: auth.uid,
    email: auth.email,
    // name: '',
    // birthday: '',
    // language: '',
  };

  const service = new LocalStateService();
  const service2 = new UpdateUserService();
  const { mutate, error, loading } = useMutation(() =>
    service2.createProfile(savedData),
  );
  const getData = async (): Promise<void> => {
    try {
      // Pull extra signup data from Async storage
      const savedLanguage = await service.getStorage('wmLanguage');
      translation = getTranslation(savedLanguage);
      if (savedLanguage) {
        savedData.language = savedLanguage;
      }
      const savedBirthday = await service.getStorage('wmBirthday');
      if (savedBirthday) {
        savedData.birthday = savedBirthday;
      }
      const savedName = await service.getStorage('wmName');
      if (savedName) {
        savedData.name = savedName;
      }

      // Save info to database
      mutate();
      setIsGetting(false);
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
    <>
      <EditProfileScreen requiredPrompt />
      {error && <Error error={error} />}
      {asyncError && <Error error={asyncError} />}
    </>
  );
};

export default SaveUserScreen;
