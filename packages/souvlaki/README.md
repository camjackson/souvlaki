# 🌯 `souvlaki` 🌯

Composable React.js test wrappers, making it easy to test context-heavy components.

- [Jump to example usage](#the-solution)
- [Jump to API reference](#api-reference)
- [Jump to companion libraries](#companion-libraries)

```sh
yarn add -D souvlaki
# OR
npm i -D souvlaki
```

## The problem

Complex React apps often use a lot of context, either directly, or indirectly through libraries:

```jsx
const MyComponent = () => {
  const shoppingCartState = useContext(ShoppingCartContext);
  const { productId } = useParams(); // react-router
  const { data } = useQuery(GET_PRODUCTS); // apollo-client

  // ...
};
```

This is convenient, but it can make testing harder. For every context consumed, a provider must be wrapped around it during testing. (Putting aside `jest.mock()`-based solutions which can be unreliable if you are not very careful to mock correctly).

Thankfully, `react-testing-library` provides a nice API for wrapping components when rendering them:

```jsx
render(<MyComponent />, { wrapper: MyTestWrapper });
```

The challenge is setting up the wrapper exactly as you need it for each test. One common approach is to create a single mega-wrapper that covers everything:

```jsx
export const BigHugeTestWrapper = ({ children }) => (
  <ShoppingCartContext.Provider>
    <MemoryRouter>
      <ApolloProvider client={buildTestApolloClient()}>
        {children}
      </ApolloProvider>
    </MemoryRouter>
  </ShoppingCartContext.Provider>
);
```

This works OK, but as your test suite grows to cover lots of different scenarios, the test wrapper often becomes heavily parameterised and a bit unweildy.

What we really want is smaller, composable test wrappers, and an easy way to grab just the ones we need, configure them for a specific test case, and then combine them.

## The solution

Souvlaki lets you define all the wrappers that you need across your test suite:

```jsx
// testWrappers.jsx
import { createHelper } from 'souvlaki';

export const withCart = createHelper((cartState) => ({ children }) => (
  <ShoppingCartContext.Provider value={cartState}>
    {children}
  </ShoppingCartContext.Provider>
));

export const withRoute = createHelper((currentRoute) => ({ children }) => (
  <MemoryRouter initialEntries={[currentRoute]}>{children}</MemoryRouter>
));

export const withApollo = createHelper(() => ({ children }) => (
  <ApolloProvider client={buildTestApolloClient()}>{children}</ApolloProvider>
));
```

Then you select, configure, and combine the ones you need for each test:

```jsx
// MyTestSuite.test.jsx
import { wrap } from 'souvlaki';
import { withCart, withRoute, withApollo } from './testWrappers';

it('shows the items in the shopping cart', () => {
  const cartItem = { name: 'Large lamb souvlaki' };
  const cart = { items: [cartItem] };

  render(<ShoppingCart />, { wrapper: wrap(withCart(cart)) });

  expect(screen.getByText('1 x Large lamb souvlaki')).toBeInTheDocument();
});

it('displays results for the given search string', () => {
  setupGraphqlMocks(); // Give msw a try, it's great for this!

  render(<ProductSearchPage />, {
    wrapper: wrap(
      withCart({ items: [] }),
      withRoute('/search?q=greek-food'),
      withApollo(),
    ),
  });

  expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  expect(screen.getByText('5 results for "greek food"')).toBeInTheDocument();
});
```

For more complex scenarios, you can define a _composite wrapper_. This is a wrapper that can be applied by any one of several helper functions.

```jsx
// Create two different helper functions
// Either (or both) of these can be called to apply the wrapper
const [withProfile, withProfileActions] = createHelpers(
  // The wrapper function receives two corresponding arrays of arguments
  // Each array may be empty if the corresponding helper was not used
  ([name, yearJoined], [actions]) =>
    ({ children }) => (
      <PlayerProfileProvider state={{ name, yearJoined }} actions={actions}>
        {children}
      </PlayerProfileProvider>;
    ),
);

it('shows the player info', () => {
  // Apply the wrapper with just the profile state
  render(<PlayerProfilePage />, {
    wrapper: wrap(withProfile('Jason Blake', '1999')),
  });

  expect(screen.getByText('Jason Blake')).toBeInTheDocument();
  expect(screen.getByText('Joined in 1999')).toBeInTheDocument();
});

it('can delete the profile', () => {
  const deleteProfile = jest.fn();

  // Apply the wrapper with just the profile actions
  render(<PlayerProfilePage />, {
    wrapper: wrap(withProfileActions({ deleteProfile })),
  });

  const deleteButton = screen.getByRole('button', { name: 'Delete profile' });
  userEvent.click(deleteButton);

  expect(deleteProfile).toHaveBeenCalled();
});

it('can update the profile', () => {
  const updateProfile = jest.fn();

  // Apply the wrapper with both the profile state _and_ actions
  render(<PlayerProfilePage />, {
    wrapper: wrap(
      withProfile('Jason Blake', '1999-11-25'),
      withProfileActions({ updateProfile }),
    ),
  });

  const heightInput = screen.getByRole('input', { name: 'Height' });
  userEvent.type(heightInput, '189 cm');

  expect(updateProfile).toHaveBeenCalledWith({
    name: 'Jason Blake',
    yearJoined: 1999,
    height: '189 cm',
  });
});
```

## Usage with TypeScript

The above examples can be enhanced with TypeScript to ensure that you pass the correct number and types of arguments to your helpers. The types of the helper parameters will be inferred from the
types that you declare on your wrapper function's parameters.

See the examples below in the API reference for how to do this.

## API Reference

### `createHelper(wrapperFn) => Helper`

Creates a helper function that can be used to apply the supplied wrapper.

**Parameters**:

- `wrapperFn`: `(...args) => React.ComponentType`
  - A function that receives whatever values were passed to the helper, and returns a React component that wraps its children.

**Returns**:

`Helper: (...args) => void`

- A helper function that you can call to apply the given wrapper.

**Example**:

```tsx
const withUser = createHelper(
  (firstName: string, lastName: string, age: number) =>
    ({ children }) =>
      (
        <UserContext.Provider value={{ firstName, lastName, age }}>
          {children}
        </UserContext.Provider>
      ),
);

// In a test
render(<User />, { wrapper: wrap(withUser('Cam', 'Jackson', 19)) });
```

### `createHelpers(wrapperFn) => Helper[]`

Creates multiple helper functions any or all of which can be used to apply the supplied wrapper.

**Parameters**:

- `wrapperFn`: `([...args1], ..., [...argsN]) => React.ComponentType`
  - A function that receives multiple arrays of arguments, each one being populated (or not) with the values passed to a corresponding helper. It returns a React component that wraps its children.

**Returns**:

`Helper[]: [(...args1) => void, ..., (...argsN) => void]`

- An array of helper functions that you can call to apply the given wrapper. You can use any number of them at once, and the wrapper will be applied once only, with all of the arguments that were provided to all of the helpers.

**Example**:

```tsx
const [withName, withAge] = createHelpers(
  ([firstName, lastName]: [string, string], [age]: [number]) =>
    ({ children }) =>
      (
        <UserContext.Provider value={{ firstName, lastName, age }}>
          {children}
        </UserContext.Provider>
      ),
);

// In a test
render(<User />, { wrapper: wrap(withName('Cam', 'Jackson')) });
// Or:
render(<User />, { wrapper: wrap(age(19)) });
// Or:
render(<User />, { wrapper: wrap(withName('Cam', 'Jackson'), withAge(19)) });
```

### `wrap(...helperInstances) => React.ComponentType`

Composes the given helper instances together to create a React component that you can wrap around other components.

**Parameters**:

- `...helperInstances`
  - A variable number of instantiated helpers. Note that it takes multiple arguments, e.g. `wrap(withA(), withB())`, not a single array, e.g. `wrap([withA(), withB()])`.

**Returns**:

`React.Component`

- A React.js component to wrap around other components. It's a normal component, so you can do anything with it, but the intended use is as a wrapper for unit tests.

**Example**:

- See above

## Companion libraries

Support is provided for some common libraries that depend heavily on context. If you use one of these libraries, you can install a companion library alongside souvlaki, and use pre-written helpers:

- `apollo-client`: [souvlaki-apollo](https://github.com/camjackson/souvlaki/tree/main/packages/souvlaki-apollo)
- `react-router`: [souvlaki-react-router](https://github.com/camjackson/souvlaki/tree/main/packages/souvlaki-react-router)

## What's with the name?

This is a library for creating test _wrappers_. A [souvlaki](https://www.google.com/search?q=souvlaki&tbm=isch) is a Greek wrap, similar to a doner kebab, but tastier 😏🌯🇬🇷
