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
  CheckoutScreen,
  ContentScreen,
  ForgotPasswordScreen,
  TeacherScreen,
  CategoryScreen,
  FavoritesScreen,
  EditProfileScreen,
  SearchScreen,
  LibraryScreen,
  AccountScreen,
  SettingsScreen,
} from './screens';
import Nav from './primitives/Nav';
import Page from './primitives/Page';
import { CurrentUserProvider } from './context/CurrentUser';
import { LeadProvider } from './context/Lead';
import { ContentProvider } from './context/Content';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: any = null;
if (process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY) {
  stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
}

const history = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CurrentUserProvider>
        <LeadProvider>
          <ContentProvider>
            <Elements stripe={stripePromise}>
              <Router history={history}>
                <Nav />
                <Page fullPage>
                  <Switch>
                    <Route path="/access-code" component={PromoCodeScreen} />
                    <Route path="/download" component={DownloadScreen} />
                    <Route path="/login" component={AuthScreen} />
                    <Route path="/friends" component={AuthScreen} />
                    <PrivateRoute path="/checkout" component={CheckoutScreen} />
                    <PrivateRoute path="/account" component={AccountScreen} />
                    <Route path="/library" component={LibraryScreen} />
                    <Route path="/language" component={EditProfileScreen} />
                    <Route path="/search" component={SearchScreen} />
                    <Route path="/favorites" component={FavoritesScreen} />
                    <Route path="/category" component={CategoryScreen} />
                    <Route
                      path="/forgot-password"
                      component={ForgotPasswordScreen}
                    />
                    <Route path="/settings" component={SettingsScreen} />
                    <Route path="/content" component={ContentScreen} />
                    <Route path="/teacher" component={TeacherScreen} />
                    <Route path="/" component={HomeScreen} />
                  </Switch>
                </Page>
              </Router>
            </Elements>
          </ContentProvider>
        </LeadProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  );
}

export default App;
