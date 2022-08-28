import { createHelper } from 'souvlaki';
import { MemoryRouter, Route, useLocation } from 'react-router-dom';
import { Location } from 'history';
import { useEffect } from 'react';

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

type PathnameChangeNotifierProps = {
  onPathnameChange: (pathname: string) => void;
};
const PathnameChangeNotifier = ({
  onPathnameChange,
}: PathnameChangeNotifierProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    onPathnameChange(pathname);
  }, [pathname]);

  return null;
};

type LocationChangeNotifierProps = {
  onLocationChange: (location: Location) => void;
};
const LocationChangeNotifier = ({
  onLocationChange,
}: LocationChangeNotifierProps) => {
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
 * @param {function} onPathnameChange A function that's called with the new pathname on any change
 * @param {function} onLocationChange A function that's called with the new location on any change
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withRoute = createHelper(
  (
      path: string = '/',
      params?: Record<string, string>,
      onPathnameChange?: (pathname: string) => void,
      onLocationChange?: (location: Location) => void,
    ) =>
    ({ children }) => {
      const interpolatedPath = interpolatePathParams(path, params);
      const pathWithoutQueryParams = path.replace(/\?.*/, '');

      return (
        <MemoryRouter initialEntries={[interpolatedPath]}>
          {onPathnameChange && (
            <PathnameChangeNotifier onPathnameChange={onPathnameChange} />
          )}
          {onLocationChange && (
            <LocationChangeNotifier onLocationChange={onLocationChange} />
          )}
          <Route path={pathWithoutQueryParams}>{children}</Route>
        </MemoryRouter>
      );
    },
);
