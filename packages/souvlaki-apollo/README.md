# 🌯🚀 `souvlaki-apollo` 🚀🌯

[Souvlaki](https://github.com/camjackson/souvlaki) wrapper helper for [apollo-client](https://www.apollographql.com/docs/react/).
Wraps your components in an `ApolloProvider` so you don't have to.

## Installation

```sh
yarn add -D souvlaki souvlaki-apollo
# OR
npm i -D souvlaki souvlaki-apollo
```

## Usage

```tsx
// MyComponent.test.tsx
import { wrap } from 'souvlaki';
import { withApollo } from 'souvlaki-apollo';
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('wraps the component with an ApolloProvider, with a default client', () => {
    render(<MyComponent />, { wrapper: wrap(withApollo()) });

    // expect...
  });

  it('wraps the component with an ApolloProvider, with a custom client', () => {
    const client = buildApolloClient();
    render(<MyComponent />, { wrapper: wrap(withApollo(client)) });

    // expect...
  });
});
```
