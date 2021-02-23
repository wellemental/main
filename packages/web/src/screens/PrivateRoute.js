import React from 'react';
import { useCurrentUser } from '../hooks';
import { Route, Redirect } from 'react-router-dom';
import { Spinner } from '../primitives';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { user, activePlan, loading } = useCurrentUser();

  const pro = rest.pro;
  const loggedIn = !!user;

  // Need to wait until CurrentUser is done loading before it decides where to redirect
  return loading ? (
    <Spinner />
  ) : (
    <Route
      {...rest}
      render={({ location }) =>
        !loggedIn ? (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        ) : pro && activePlan ? (
          <RouteComponent />
        ) : pro && !activePlan ? (
          <Redirect to="/plans" />
        ) : (
          <RouteComponent />
        )
      }
    />
  );
};

export default PrivateRoute;
