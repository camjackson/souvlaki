import { ComponentType } from 'react';

export type Wrapper<Args extends any[]> = (...args: Args) => ComponentType;

export type HelperInstance<Args extends any[]> = {
  wrapper: Wrapper<Args>;
  args: Args;
};

type Helper<Args extends any[]> = (...args: Args) => HelperInstance<Args>;

/**
 * Creates a helper function that can be used to apply the supplied wrapper.
 *
 * @param {Wrapper} A function that receives whatever values were passed to the
 * helper, and returns a React component that wraps its children.
 * @returns {Helper} A helper function that you can call to apply the given wrapper.
 */
export const createHelper =
  <Args extends any[]>(wrapper: Wrapper<Args>): Helper<Args> =>
  (...args: Args) => ({ wrapper, args });
