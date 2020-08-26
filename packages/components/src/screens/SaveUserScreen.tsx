import React from 'react';
import Spinner from '../primitives/Spinner';
import { LocalStateService } from 'services';
import { useCurrentUser } from '../hooks';
import { Languages } from 'services';

const SaveUserScreen: React.FC = () => {
  const service = LocalStateService();
  const { auth } = useCurrentUser();

  const [birthday, setBirthday] = useState<string>();
  const [name, setName] = useState<string>();
  const [language, setLanguage] = useState<Languages>();

  // Hack to save birthday from Signup into database
  let savedData: string | null;

  const getData = async (): Promise<void> => {
    try {
    const birthday = await service.getStorage('wmBirthday'));
      
      if (birthday !== null) {
        savedData.birthday = birthday;
        service.removeStorage('wmBirthday');
      }
    } catch (err) {
      logger.error(`Failed to get birthday from async storage: ${err}`);
    }
  };
  setName(await service.getStorage('wmName'));
  const language = await service.getStorage('wmLanguage');

  getBirthday();
  return <Spinner text="Creating profile..." />;
};

export default SaveUserScreen;
