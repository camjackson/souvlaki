import {
  CompositeHelper,
  CompositeHelperInstance,
  createHelpers,
  SimpleHelper,
} from 'souvlaki';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
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

type WatcherProps = {
  onPathnameChange?: (pathname: string) => void;
  onLocationChange?: (location: Location) => void;
};
const Watcher = ({ onPathnameChange, onLocationChange }: WatcherProps) => {
  const location = useLocation();

  useEffect(() => {
    onPathnameChange?.(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    onLocationChange?.(location);
  }, [location]);

  return null;
};

export const routeHelpers = createHelpers(
  (
      [path = '/', params = {}]: [string?, Record<string, string>?],
      [otherRoutes = []]: [string[]],
      [onPathnameChange]: [((pathname: string) => void)?],
      [onLocationChange]: [((location: Location) => void)?],
    ) =>
    ({ children }) => {
      const interpolatedPath = interpolatePathParams(path, params);
      const pathWithoutQueryParams = path.replace(/\?.*/, '');

      return (
        <MemoryRouter initialEntries={[interpolatedPath]}>
          <Watcher
            onPathnameChange={onPathnameChange}
            onLocationChange={onLocationChange}
          />
          <Routes>
            <Route path={pathWithoutQueryParams} element={children} />
            {otherRoutes.map((path) => (
              <Route key={path} path={path} element={<></>} />
            ))}
          </Routes>
        </MemoryRouter>
      );
    },
);

/**
 * A helper you can call to apply a MemoryRouter wrapper to your components.
 * @param {string} path The current path, e.g., '/home', or '/users/:userId'
 * @param {object} params Key/value pairs to fill in path parameters, e.g. { userId: 'abc123' }
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withRoute = routeHelpers[0] as (
  path?: string,
  params?: Record<string, string>,
) => CompositeHelperInstance<any, any>;

/**
 * A helper you can call to specify additional empty routes, which can then be linked to
 * @param {string[]} paths Route paths, other than the current one, which should be available to link to
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withOtherRoutes = routeHelpers[1] as (
  paths: string[],
) => CompositeHelperInstance<any, any>;

/**
 * A helper you can call to be notified of changes to the pathname
 * @param {function} onPathnameChange A function that's called with the new pathname on any change
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withPathnameWatcher = routeHelpers[2] as (
  onPathnameChange: () => void,
) => CompositeHelperInstance<any, any>;

/**
 * A helper you can call to be notified of changes to the location
 * @param {function} onLocationChange A function that's called with the new location on any change
 * @returns {HelperInstance} A helper instance to be passed to `souvlaki.wrap()`
 */
export const withLocationWatcher = routeHelpers[3] as (
  onLocationChange: () => void,
) => CompositeHelperInstance<any, any>;
