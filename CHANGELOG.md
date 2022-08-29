# Changelog

## Un-released changes

## `souvlaki`

- **Feature:** `createContextHelper` ([#3](https://github.com/camjackson/souvlaki/issues/3))
- **Types:** Update return type of `wrap()`, it should play nicely with `@testing-library/react@13` now ([#4](https://github.com/camjackson/souvlaki/issues/4))
- **Types:** Export internal types in case people want to use them for extensions etc ([#2](https://github.com/camjackson/souvlaki/issues/2))
- **Docs:** All sorts of misc improvements to docs & comments ([#5](https://github.com/camjackson/souvlaki/issues/5), [#6](https://github.com/camjackson/souvlaki/issues/6))
- **Chore:** Lots of dependency upgrades and other internal fixes

## `souvlaki-apollo`

- **Chore:** Lots of dependency upgrades and other internal fixes

## `souvlaki-react-router`

- **Breaking change:** Only support react-router 6. It's too hard to support both 5 & 6. Sorry.
  - RR6 has a comprehensive upgrade guide here: https://reactrouter.com/en/main/upgrading/v5
- **Breaking change:** `withRoute` has been split into four separate, smaller helpers:

  - Here's how to upgrade:

    ```ts
    // Old usage:
    wrap(
      withRoute(
        '/people/:personId', // The current route
        { personId: 'abc123' }, // Path params for the current route
        onPathnameChange, // Usually a jest.fn()
        onLocationChange, // Usually a jest.fn()
      ),
    );

    // Equivalent new usage:
    wrap(
      withRoute('/people/:personId', { personId: 'abc123' }), // Same first two args
      withPathnameWatcher(onPathnameChange), // Now its own separate helper
      withLocationWatcher(onLocationChange), // Now its own separate helper
    );
    ```

  - If you were previously skipping some parameters with `undefined` so you could
    supply the later ones, you can now just leave out the relevant helper entirely,
    applying only the helpers you're actually interested in
  - You can use any combination of the helpers, they will be combined into a
    single wrapper component.

- **Feature:** `withOtherRoutes`

  - In react-router 5, following a `<Link/>` to a non-existent route was fine
  - In react-router 6, this now causes a console warning: `'No routes matched location "/whatever"'`
  - With this new helper you can supply additional route paths, which won't
    render any content. This prevents the console warnings when testing a
    component in isolation and clicking its links.
  - Example Usage:

    ```ts
    wrap(
      withRoute('/current-path'), // This isn't required, it's just for the example
      withOtherRoutes(['/some-other-path', 'and-another-path']),
    );
    ```

- **Chore:** Lots of dependency upgrades and other internal fixes
