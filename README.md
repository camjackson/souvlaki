# souvlaki 🌯

Composable react test wrappers, making it easy to test context-heavy components.

## The problem

Complex React apps often use a lot of context, either directly or indirectly through libraries:

```jsx
const MyComponent = () => {
  // Custom context:
  const shoppingCartState = useContext(ShoppingCartContext);
  // Route params from react-router
  const { productId } = useParams();
  // Graphql queries using Apollo
  const { data } = useQuery(GET_PRODUCTS);

  // ...
};
```

It's convenient for a component to grab all the things it needs from context rather than drilling props through many layers, but it can make testing more difficult. For every context that a component consumes, a provider must be wrapped around it during testing (putting aside `jest.mock()`-based solutions which can be unreliable if you are not very careful to mock correctly).

Thankfully, `react-testing-library` provides a convenient API for wrapping components when rendering them:

```jsx
render(<MyComponent />, { wrapper: MyTestWrapper });
```

The challenge is setting up the wrapper exactly as you need it for the test. One common approach is to create a single mega-wrapper that covers everything:

```jsx
export const MyTestWrapper = ({ children }) => (
  <ShoppingCartContext.Provider>
    <MemoryRouter>
      <ApolloProvider client={buildTestApolloClient()}>
        {children}
      </ApolloProvider>
    </MemoryRouter>
  </ShoppingCartContext.Provider>
);
```

This works OK, but as the number of different test cases grow, the test wrapper often becomes heavily parameterised in order to support different combinations of initial state. It quickly becomes unweildy.

What we really want is the ability to create smaller, composable test wrappers, and an easy way to grab just the ones we need, with the appropriate configuration for the test that we're trying to write.

## The solution

Souvlaki does just that. It lets you define all the wrappers that you need across your project:

```jsx
// In wrapperHelpers.js
import { createHelper } from 'souvlaki';

const withShoppingCart = createHelper((shoppingCartState) => ({ children }) => (
  <ShoppingCartContext.Provider value={shoppingCartState}>
    {children}
  </ShoppingCartContext.Provider>
));

const withRoute = createHelper((currentRoute) => ({ children }) => (
  <MemoryRouter initialEntries={[currentRoute]}>{children}</MemoryRouter>
));

const withApollo = createHelper(() => ({ children }) => (
  <ApolloProvider client={buildTestApolloClient()}>{children}</ApolloProvider>
));
```

And then lets you pick, choose, and combine them for each test:

```jsx
// In your test suite
import { wrap } from 'souvlaki';
import { withShoppingCart, withRoute, withApollo } from './wrapperHelpers.js';

it('shows the items in the shopping cart', () => {
  const cartItem = { name: 'Large lamb souvlaki' };
  const cart = { items: [cartItem] };

  render(<ShoppingCart />, { wrapper: wrap(withShoppingCart(cart)) });

  expect(screen.getByText('1 x Large lamb souvlaki')).toBeInTheDocument();
});

it('displays results for the given search string', () => {
  setupGraphqlMocks(); // Give msw a try, it's great for this!

  render(<ProductSearchPage />, {
    wrapper: wrap(
      withShoppingCart({ items: [] }),
      withRoute('/search?q=greek-food'),
      withApollo(),
    ),
  });

  expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  expect(screen.getByText('5 results for "greek food"')).toBeInTheDocument();
});
```

## What's with the name?

This is a library for creating test _wrappers_. A [souvlaki](https://www.google.com/search?q=souvlaki&tbm=isch) is a Greek wrap, similar to a doner kebab.

## TODO:

- [ ] Features:
  - [ ] Better examples in the tests
- [ ] Docs:
  - [x] Problem & solution
  - [ ] Examples
    - [x] Simple
    - [ ] Composite
  - [ ] API reference
  - [ ] Typescript-specific stuff?
  - [ ] JSDocs on all functions and types
- [ ] Separate packages for specific libraries
  - [ ] yarn workspaces for this?
  - [ ] Apollo
  - [ ] React router
