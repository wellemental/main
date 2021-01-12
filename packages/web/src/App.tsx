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
  PlansScreen,
  CheckoutScreen,
  ContentScreen,
  ForgotPasswordScreen,
  SubscriptionScreen,
  StripePortal,
  TeacherScreen,
  CategoryScreen,
  FavoritesScreen,
  EditProfileScreen,
  SearchScreen,
  LibraryScreen,
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
                <Page fullPage background="general">
                  <Switch>
                    <PrivateRoute
                      path="/access-code"
                      component={PromoCodeScreen}
                    />
                    <PrivateRoute path="/download" component={DownloadScreen} />
                    <Route path="/login" component={AuthScreen} />
                    <Route path="/friends" component={AuthScreen} />
                    <PrivateRoute path="/checkout" component={CheckoutScreen} />
                    <PrivateRoute path="/plans" component={PlansScreen} />
                    <PrivateRoute
                      path="/subscription"
                      component={SubscriptionScreen}
                    />
                    <PrivateRoute path="/stripe" component={StripePortal} />
                    <PrivateRoute path="/library" component={LibraryScreen} />
                    <PrivateRoute
                      path="/language"
                      component={EditProfileScreen}
                    />
                    <PrivateRoute pro path="/search" component={SearchScreen} />
                    <PrivateRoute
                      pro
                      path="/favorites"
                      component={FavoritesScreen}
                    />
                    <PrivateRoute path="/category" component={CategoryScreen} />
                    <Route
                      path="/forgot-password"
                      component={ForgotPasswordScreen}
                    />
                    <PrivateRoute path="/settings" component={SettingsScreen} />
                    <PrivateRoute path="/content" component={ContentScreen} />
                    <PrivateRoute path="/teacher" component={TeacherScreen} />
                    <PrivateRoute path="/" component={HomeScreen} />
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
