import React from 'react';
import { useRouteMatch as ogUseRouteMatch } from 'react-router-dom';

export const useRouteMatch = (url: string): string => {
  const match: { params: { route: string } } | null = ogUseRouteMatch(
    `/${url}/:route`,
  );
  let route: string = '';

  if (match) {
    route = match.params.route;
  }

  return route;
};
