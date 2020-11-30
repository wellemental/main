import React from 'react';
import './App.css';
import { Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './assets/styles/theme';
import { createBrowserHistory } from 'history';
import {
  AuthScreen,
  DownloadScreen,
  PromoCodeScreen,
  HomeScreen,
  PrivateRoute,
  ContentScreen,
  TeacherScreen,
  FavoritesScreen,
  EditProfileScreen,
  SearchScreen,
  LibraryScreen,
  SettingsScreen,
} from './screens';
import Nav from './primitives/Nav';
import Page from './primitives/Page';
import { CurrentUserProvider } from './context/CurrentUser';
import { ContentProvider } from './context/Content';

const history = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CurrentUserProvider>
        <ContentProvider>
          <Router history={history}>
            <Nav />
            <Page fullPage>
              <Switch>
                <Route path="/access-code" component={PromoCodeScreen} />
                <Route path="/download" component={DownloadScreen} />
                <Route path="/login" component={AuthScreen} />
                <Route path="/library" component={LibraryScreen} />
                <Route path="/language" component={EditProfileScreen} />
                <Route path="/search" component={SearchScreen} />
                <Route path="/favorites" component={FavoritesScreen} />
                <Route path="/settings" component={SettingsScreen} />
                <Route path="/content" component={ContentScreen} />
                <Route path="/teacher" component={TeacherScreen} />
                <Route path="/" component={HomeScreen} />
              </Switch>
            </Page>
          </Router>
        </ContentProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  );
}

export default App;
