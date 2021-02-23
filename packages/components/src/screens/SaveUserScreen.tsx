import React, { useState, useEffect } from 'react';
import Spinner from '../primitives/Spinner';
import {
  LocalStateService,
  ApplicationError,
  UpdateUserService,
  // logger,
  InitialUserDoc,
  Languages,
} from 'services';
import EditProfileScreen from './EditProfileScreen';
import { Error } from '../primitives';
import { useCurrentUser, useMutation } from '../hooks';
import { getTranslation } from '../translations';
import { English } from '../translations/en';

const SaveUserScreen: React.FC = () => {
  const { auth, user } = useCurrentUser();
  let translation = English;

  const [gettingStorage, setIsGetting] = useState(true);
  const [asyncError, setAsyncError] = useState<ApplicationError>();

  const savedData: Partial<InitialUserDoc> = {
    id: auth.uid,
    email: auth.email,
  };

  const service = new LocalStateService();
  const service2 = new UpdateUserService();
  const { mutate, error, loading } = useMutation(() =>
    service2.createProfile(savedData),
  );

  const getData = async (): Promise<void> => {
    try {
      // Pull extra signup data from Async storage
      // Set defaults in case of error with local storage to avoid blocked UX
      const savedLanguage = await service.getStorage('wmLanguage');
      translation = getTranslation(savedLanguage);
      savedData.language = savedLanguage ? savedLanguage : Languages.En;
      const savedBirthday = await service.getStorage('wmBirthday');
      savedData.birthday = savedBirthday ? savedBirthday : 'N/A';
      const savedName = await service.getStorage('wmName');
      savedData.name = savedName ? savedName : '';

      // Save info to database
      mutate();
    } catch (err) {
      setIsGetting(false);
      setAsyncError(
        new ApplicationError(translation['Error creating profile. Try again.']),
      );
      // logger.error(`Failed to get data from async storage: ${err}`);
    }
  };

  useEffect(() => {
    if (user) {
      if (!user.name || !user.birthday || !user.language) {
        getData();
      }
    }
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
