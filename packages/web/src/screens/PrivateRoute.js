import React from 'react';
import { useCurrentUser } from '../hooks';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ component: RouteComponent, ...rest }) {
  const { user } = useCurrentUser();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
          <RouteComponent />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
