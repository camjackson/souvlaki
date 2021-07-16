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
import { wrap } from 'souvlaki';
import { withRoute } from 'souvlaki-react-router';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('can provide a route with no params', () => {
    render(<TestComponent />, { wrapper: wrap(withRoute('/some-page')) });

    //... expect
  });

  it('can provide a route with params', () => {
    render(<TestComponent />, {
      wrapper: wrap(withRoute('/users/:id', { id: 'abc123' })),
    });

    //... expect
  });

  it('can notify when the pathname changes', () => {
    const onPathnameChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(withRoute('/old-route', {}, onPathnameChange)),
    });

    //... click a link

    expect(onPathnameChange).toHaveBeenCalledWith('/new-route');
  });

  it('can notify when the location changes', () => {
    const onLocationChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(
        withRoute('/old-route', undefined, undefined, onLocationChange),
      ),
    });

    //... click a link

    expect(onLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/new-route' }),
    );
  });
});
```
