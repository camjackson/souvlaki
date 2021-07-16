import { createHelper } from 'souvlaki';
import { MemoryRouter, Route } from 'react-router-dom';
import React from 'react';

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

/**
 * A helper you can call to apply a MemoryRouter wrapper to your components.
 * @param {string} path: The current path, e.g., '/home', or '/users/:userId'
 * @param {object} params: Key/value pairs to fill in path parameters, e.g. { userId: 'abc123' }
 * @returns {HelperInstance} To be passed to `souvlaki.wrap()`
 */
export const withRoute = createHelper(
  (path: string = '/', params?: Record<string, string>): React.ComponentType =>
    ({ children }) => {
      const interpolatedPath = interpolatePathParams(path, params);
      return (
        <MemoryRouter initialEntries={[interpolatedPath]}>
          <Route path={path}>{children}</Route>
        </MemoryRouter>
      );
    },
);
