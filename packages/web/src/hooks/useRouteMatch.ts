import { useRouteMatch as ogUseRouteMatch } from 'react-router-dom';

export const useRouteMatch = (): string => {
  const match: { params: { route: string } } | null = ogUseRouteMatch(
    `/:base/:route`,
  );
  let route: string = '';

  if (match) {
    route = match.params.route;
  }

  return route;
};
