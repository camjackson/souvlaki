# 🌯🧭 `souvlaki-react-router` 🧭🌯

[Souvlaki](https://github.com/camjackson/souvlaki) wrapper helper for [react-router](https://reactrouter.com/).
Wraps your components in a `MemoryRouter` so you don't have to.

## Installation

```sh
yarn add -D souvlaki souvlaki-react-router
# OR
npm i -D souvlaki souvlaki-react-router
```

## Usage

```tsx
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { wrap } from 'souvlaki';
import {
  withRoute,
  withOtherRoutes,
  withLocationWatcher,
  withPathnameWatcher,
} from 'souvlaki-react-router';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('can provide a route with no params', () => {
    render(<TestComponent />, { wrapper: wrap(withRoute('/some-page')) });

    // expect() things to have been rendered inside the given route
  });

  it('can provide a route with params', () => {
    render(<TestComponent />, {
      wrapper: wrap(withRoute('/users/:id', { id: 'abc123' })),
    });

    // expect() things to have been rendered with the given path params
  });

  it('can provide additional empty routes that can be linked to', () => {
    render(<TestComponent />, {
      wrapper: wrap(
        withRoute('/current-route'),
        withOtherRoutes(['/other-route', '/third-route']),
      ),
    });

    // can now safely click links to the given 'other' routes
    // (without this, you will get console errors when you
    //   try to navigate to non-existent routes)
  });

  it('can notify when the pathname changes', () => {
    const onPathnameChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(
        withRoute('/current-route'),
        withOtherRoutes(['/new-route']),
        withPathnameWatcher(onPathnameChange),
      ),
    });

    // [click a link]

    expect(onPathnameChange).toHaveBeenCalledWith('/new-route');
  });

  it('can notify when the location changes', () => {
    const onLocationChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(
        withRoute('/current-route'),
        withOtherRoutes(['/new-route']),
        withLocationWatcher(onLocationChange),
      ),
    });

    // [click a link]

    expect(onLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/new-route' }),
    );
  });
});
```
