import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import wellemental from './assets/native-base-theme/variables/wellemental';
import {
  CurrentUserProvider,
  ContentProvider,
  ServicesProvider,
} from './context';
import Navigator from './Navigator';
// import { useCurrentUser, useContent } from './hooks';
// import { ObserveUserService } from 'services';
// import { English } from './translations/en';
// import { Español } from './translations/es';
import SplashScreen from 'react-native-splash-screen';

const App: React.FC = () => {
  // const [user, setUser] = useState();
  // const [userObserver] = useState(new ObserveUserService(setUser));
  // useEffect(() => {
  //   userObserver.subscribe();

  //   return userObserver.unsubscribe();
  // }, []);

  // const { user, translation } = useCurrentUser();
  // const { content, teachers } = useContent();

  // !user || !content || !teachers ? (
  //   <Spinner
  //     text={
  //       !user
  //         ? 'Loading user...'
  //         : !content
  //         ? 'Loading Content...'
  //         : 'Loading teachers...'
  //     }
  //   />
  // ) :

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <CurrentUserProvider>
      <StyleProvider style={getTheme(wellemental)}>
        <ContentProvider>
          <ServicesProvider>
            {/* <CurrentUser2.Provider
            value={{
              user: user,
              translation:
                user && user.language === 'Español' ? Español : English,
            }}> */}
            <Root>
              {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
              <Navigator />
            </Root>
            {/* </CurrentUser2.Provider> */}
          </ServicesProvider>
        </ContentProvider>
      </StyleProvider>
    </CurrentUserProvider>
  );
};

export default App;
