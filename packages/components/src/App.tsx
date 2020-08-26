import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Spinner } from './primitives';
import { StyleProvider, Root } from 'native-base';
import getTheme from './assets/native-base-theme/components';
import wellemental from './assets/native-base-theme/variables/wellemental';
import { CurrentUserProvider, ContentProvider } from './context';
import Navigator from './Navigator';
import { useCurrentUser, useContent } from './hooks';
import { ObserveUserService } from 'services';
import { English } from './translations/en';
import { Español } from './translations/es';

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

  return (
    <CurrentUserProvider>
      <StyleProvider style={getTheme(wellemental)}>
        <ContentProvider>
          {/* <CurrentUser2.Provider
            value={{
              user: user,
              translation:
                user && user.language === 'Español' ? Español : English,
            }}> */}
          <Root>
            <StatusBar barStyle="dark-content" />
            <Navigator />
          </Root>
          {/* </CurrentUser2.Provider> */}
        </ContentProvider>
      </StyleProvider>
    </CurrentUserProvider>
  );
};

export default App;
