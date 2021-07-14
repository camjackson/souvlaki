# 🌯 souvlaki 🌯

Composable React.js test wrappers, making it easy to test context-heavy components.

[Jump to example usage.](#the-solution)

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
import { withCart, withRoute, withApollo } from './testWrappers.js';

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
      <UserProfileProvider state={{ name, yearJoined }} actions={actions}>
        {children}
      </UserProfileProvider>;
    ),
);

it('shows the user info', () => {
  // Apply the wrapper with just the profile state
  render(<UserProfilePage />, {
    wrapper: wrap(withProfile('Jason Blake', '1999')),
  });

  expect(screen.getByText('Jason Blake')).toBeInTheDocument();
  expect(screen.getByText('Joined in 1999')).toBeInTheDocument();
});

it('can delete the profile', () => {
  const deleteProfile = jest.fn();

  // Apply the wrapper with just the profile actions
  render(<UserProfilePage />, {
    wrapper: wrap(withProfileActions({ deleteProfile })),
  });

  const deleteButton = screen.getByRole('button', { name: 'Delete profile' });
  userEvent.click(deleteButton);

  expect(deleteProfile).toHaveBeenCalled();
});

it('can update the profile', () => {
  const updateProfile = jest.fn();

  // Apply the wrapper with both the profile state _and_ actions
  render(<UserProfilePage />, {
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

## What's with the name?

This is a library for creating test _wrappers_. A [souvlaki](https://www.google.com/search?q=souvlaki&tbm=isch) is a Greek wrap, similar to a doner kebab, but tastier 😏🌯🇬🇷

## TODO:

- [ ] Features:
  - [ ] Better examples in the tests
- [ ] Docs:
  - [x] Problem & solution
  - [ ] Examples
    - [x] Simple
    - [ ] Composite
  - [ ] API reference
  - [ ] Installation instructions
  - [ ] Typescript-specific stuff?
  - [ ] JSDocs on all functions and types
- [ ] Separate packages for specific libraries
  - [ ] yarn workspaces for this?
  - [ ] Apollo
  - [ ] React router
