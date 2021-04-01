import React from 'react';
import { Route as RrRoute } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { RouteType } from './routes';

type RouteProps = {
  route: RouteType;
};

const Route: React.FC<RouteProps> = ({ route }) => {
  const Link = route.loggedIn ? PrivateRoute : RrRoute;

  return <RrRoute path={route.slug} component={route.component} />;
};

export default Route;
