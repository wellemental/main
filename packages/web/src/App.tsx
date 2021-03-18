import React from 'react';
import './App.css';
import { Router, Switch, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './assets/styles/theme';
import { createBrowserHistory } from 'history';
import {
  AuthScreen,
  DownloadScreen,
  PromoCodeScreen,
  HomeScreen,
  PlansScreen,
  CheckoutScreen,
  ContentScreen,
  ForgotPasswordScreen,
  SubscriptionScreen,
  TeachersScreen,
  StripePortal,
  MeditateScreen,
  LearnScreen,
  SleepScreen,
  MoveScreen,
  TeacherScreen,
  CategoryScreen,
  FavoritesScreen,
  EditProfileScreen,
  SearchScreen,
  LibraryScreen,
  SettingsScreen,
} from './screens';
import Nav from './primitives/page/Nav';
import ScrollToTop from './primitives/utils/ScrollToTop';
import Page from './primitives/page/Page';
import Footer from './primitives/page/Footer';
import { CurrentUserProvider } from './context/CurrentUser';
import { LeadProvider } from './context/Lead';
import { ServicesProvider } from './context/Services';
import { ContentProvider } from './context/Content';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PrivateRoute } from './navigation';

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
            <ServicesProvider>
              <Elements stripe={stripePromise}>
                <Router history={history}>
                  <ScrollToTop />
                  <Nav />
                  <Page fullPage background="general">
                    <Switch>
                      <PrivateRoute
                        path="/access"
                        component={PromoCodeScreen}
                      />
                      <PrivateRoute
                        path="/download"
                        component={DownloadScreen}
                      />
                      <Route path="/login" component={AuthScreen} />
                      <Route path="/friends" component={AuthScreen} />
                      <PrivateRoute
                        path="/checkout"
                        component={CheckoutScreen}
                      />
                      <PrivateRoute path="/plans" component={PlansScreen} />

                      <PrivateRoute
                        path="/subscription"
                        component={SubscriptionScreen}
                      />
                      <PrivateRoute path="/stripe" component={StripePortal} />
                      <PrivateRoute path="/library" component={LibraryScreen} />
                      <PrivateRoute path="/sleep" component={SleepScreen} />
                      <PrivateRoute
                        path="/meditate"
                        component={MeditateScreen}
                      />
                      <PrivateRoute path="/learn" component={LearnScreen} />
                      <PrivateRoute path="/move" component={MoveScreen} />
                      <PrivateRoute
                        path="/language"
                        component={EditProfileScreen}
                      />
                      <PrivateRoute
                        pro
                        path="/search"
                        component={SearchScreen}
                      />
                      <PrivateRoute
                        pro
                        path="/favorites"
                        component={FavoritesScreen}
                      />
                      <PrivateRoute
                        path="/category"
                        component={CategoryScreen}
                      />
                      <Route
                        path="/forgot-password"
                        component={ForgotPasswordScreen}
                      />
                      <PrivateRoute
                        path="/settings"
                        component={SettingsScreen}
                      />
                      <PrivateRoute path="/content" component={ContentScreen} />
                      <PrivateRoute path="/teacher" component={TeacherScreen} />
                      <PrivateRoute
                        path="/teachers"
                        component={TeachersScreen}
                      />

                      <PrivateRoute path="/" component={HomeScreen} />
                    </Switch>
                    <Footer />
                  </Page>
                </Router>
              </Elements>
            </ServicesProvider>
          </ContentProvider>
        </LeadProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  );
}

export default App;
