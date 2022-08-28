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
// This is pretty clunky, even with just three providers with a single prop each!
export const BigHugeTestWrapper = ({
  cartState = {},
  currentRoute = '/',
  apolloClient = buildTestApolloClient(),
  children,
}) => (
  <ShoppingCartContext.Provider value={cartState}>
    <MemoryRouter initialValues={[currentRoute]}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </MemoryRouter>
  </ShoppingCartContext.Provider>
);
```

This works OK, but as your test suite grows to cover lots of different scenarios, the test wrapper often becomes heavily parameterised and a bit unweildy.

What we really want is smaller, composable test wrappers, and an easy way to grab just the ones we need, configure them for a specific test case, and then combine them.

## The solution

### `createHelper`

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

### `wrap`

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

### `createContextHelper`

Our `withCart` helper above is a very common case: a plain React context provider,
with a value given either when creating the helper or when applying it. Souvlaki
provides a convenient shorthand for this:

```tsx
import { createContextHelper } from 'souvlaki';

const withCart = createContextHelper(ShoppingCartContext, { items: [] });
// OR:
const withCart = createContextHelper(ShoppingCartContext);
```

Either of the above is valid, but in the second example, a value will be mandatory
when applying the wrapper, i.e. `withCart(someValue)`.

### `createHelpers` (note the s!)

For complex context providers, it can still feel too heavy to have a single all-or-nothing
helper like: `withBigHugeThing(somethingComplex)`. It's nicer if we can break
it down into several smaller helpers, which later get re-combined into a single
instance of the context provider if any of those helpers were applied.

That's what _composite wrappers_ do. Imagine if our shopping cart context had
both state (data) and actions (functions), and we want to apply the context
by specifying either the state, the actions, or both:

```jsx
import { createHelpers, wrap } from 'souvlaki';

// Create two different helper functions
// Either (or both) of these can be called to apply the wrapper
const [withCartState, withCartActions] = createHelpers(
  // The wrapper function receives two arrays as its arguments. Each array
  // corresponds to the parameters of the helper functions that we're creating.
  // Each array may end up empty if the corresponding helper was not applied.
  ([state], [actions]) =>
    ({ children }) => (
      <ShoppingCartContext.Provider value={{ state, actions }}>
        {children}
      </ShoppingCartContext.Provider>;
    ),
);

it('shows the count of items in the cart', () => {
  // Apply the wrapper with just the cart state (don't care about actions)
  render(<ShoppingCart />, {
    wrapper: wrap(withCartState({ items: ['Large chips'] })),
  });

  expect(screen.getByText('1 item(s)')).toBeInTheDocument();
});

it('can empty the cart', () => {
  const emptyTheCart = jest.fn();

  // Apply the wrapper with just the mocked cart actions (don't care about state)
  render(<ShoppingCart />, {
    wrapper: wrap(withCartActions({ emptyTheCart })),
  });

  const emptyButton = screen.getByRole('button', { name: 'Empty cart' });
  userEvent.click(emptyButton);

  expect(emptyTheCart).toHaveBeenCalled();
});

it('can increase the count on an item', () => {
  const addItem = jest.fn();

  // Apply the wrapper with both the cart state _and_ mocked cart actions
  // Only a single context provider will be instantiated
  render(<ShoppingCart />, {
    wrapper: wrap(
      withCartState({ items: ['Saganaki'] }),
      withCartActions({ addItem }),
    ),
  });

  const increaseButton = screen.getByRole('button', { name: '+' });
  userEvent.click(increaseButton);

  expect(addItem).toHaveBeenCalledWith('Saganaki');
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

- `wrapperFn`: `(...args) => ReactComponent`
  - A function that receives whatever values were passed to the helper, and returns a React component that wraps its children.

**Returns**:

`Helper: (...args) => HelperInstance`

- A helper function that you can call to apply the given wrapper.

**Example 1: A helper that wraps its children with the given component (no props or helper params)**

```tsx
const withUser = createHelper(() => UserContext.Provider);

// In a test
render(<User />, { wrapper: wrap(withUser()) });
```

**Example 2: A helper that wraps its children with the given component, with hard-coded props (no helper params)**

```tsx
const withUser = createHelper(() => ({ children }) => (
  <UserContext.Provider value={{ name: 'Cam Jackson' }}>
    {children}
  </UserContext.Provider>
));

// In a test
render(<User />, { wrapper: wrap(withUser()) });
```

**Example 3: A helper that wraps its children with the given component, with the helper's params passed as a props**

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

### `createContextHelper(Context, defaultValue) => Helper`

**Parameters**:

- `Context`: `React.Context`
  - A context object, one returned by `React.createContext`.

**Returns**:

`Helper: (...args) => HelperInstance`

- A helper function that you can call to apply the given wrapper.

**Example 1: A context helper with a default value**

```tsx
const withUser = createContextHelper(UserContext.Provider, someDefaultUser);

// In a test
render(<User />, { wrapper: wrap(withUser()) });
// OR: override the default
render(<User />, { wrapper: wrap(withUser(someSpecificUser)) });
```

**Example 2: A context helper with no default value**

```tsx
const withUser = createContextHelper(UserContext.Provider);

// In a test, the user is now mandatory here:
render(<User />, { wrapper: wrap(withUser(someUser)) });
```

### `createHelpers(wrapperFn) => Helper[]`

Creates multiple helper functions any or all of which can be used to apply the supplied wrapper.

**Parameters**:

- `wrapperFn`: `([...args1], ..., [...argsN]) => ReactComponent`
  - A function that receives multiple arrays of arguments, each one being populated (or not) with the values passed to a corresponding helper. It returns a React component that wraps its children.

**Returns**:

```
Helper[]: [
  (...args1) => HelperInstance,
  ...,
  (...argsN) => HelperInstance,
]
```

- An array of helper functions that you can call to apply the given wrapper. You can use any number of them, and the wrapper will be applied once only, with all of the arguments that were provided to all of the helpers.

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

// In a test, use one:
render(<User />, { wrapper: wrap(withName('Cam', 'Jackson')) });
// Or the other:
render(<User />, { wrapper: wrap(withAge(19)) });
// Or both (in either order):
render(<User />, { wrapper: wrap(withName('Cam', 'Jackson'), withAge(19)) });
```

### `wrap(...helperInstances) => ReactComponent`

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
