import { createHelper } from 'souvlaki';
import { MemoryRouter, Route, useLocation } from 'react-router-dom';
import { Location } from 'history';
import React, { useEffect } from 'react';

const interpolatePathParams = (
  path: string,
  params?: Record<string, string>,
): string => {
  if (!params) {
    return path;
  }

  let result = path;
  Object.entries(params).forEach(([key, val]) => {
    result = result.replace(`:${key}`, val);
  });
  return result;
};

type Props = {
  onLocationChange: (location: Location) => void;
};
const LocationChangeNotifier = ({ onLocationChange }: Props) => {
  const location = useLocation();

  useEffect(() => {
    onLocationChange(location);
  }, [location]);

  return null;
};

/**
 * A helper you can call to apply a MemoryRouter wrapper to your components.
 * @param {string} path The current path, e.g., '/home', or '/users/:userId'
 * @param {object} params Key/value pairs to fill in path parameters, e.g. { userId: 'abc123' }
 * @param {function} onLocationChange A function that's called with the new location on any change
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withRoute = createHelper(
  (
      path: string = '/',
      params?: Record<string, string>,
      onLocationChange?: (location: Location) => void,
    ): React.ComponentType =>
    ({ children }) => {
      const interpolatedPath = interpolatePathParams(path, params);
      return (
        <MemoryRouter initialEntries={[interpolatedPath]}>
          {onLocationChange && (
            <LocationChangeNotifier onLocationChange={onLocationChange} />
          )}
          <Route path={path}>{children}</Route>
        </MemoryRouter>
      );
    },
);
