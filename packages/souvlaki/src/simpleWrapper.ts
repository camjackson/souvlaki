import { ReactComponent } from './util';

/**
 * A function that takes args collected by a helper, and returns a React component.
 * This is the double-arrow function that is passed into `createHelper`.
 */
export type SimpleWrapper<Args extends unknown[]> = (
  ...args: Args
) => ReactComponent;

/**
 * An instantiated helper, to be passed to `wrap`.
 * This is the object returned by calling `withWhatever(someArgs)`.
 * It contains the wrapper function along with the args given to this instance of it.
 */
export type SimpleHelperInstance<Args extends unknown[]> = {
  helperType: 'simple';
  wrapper: SimpleWrapper<Args>;
  args: Args;
};

/**
 * A function that takes args for a wrapper and returns a helper instance.
 * This is the function that is created and returned by `createHelper`.
 */
export type SimpleHelper<Args extends unknown[]> = (
  ...args: Args
) => SimpleHelperInstance<Args>;

/**
 * Creates a helper function that can be used to apply the supplied wrapper.
 *
 * @param {SimpleWrapper} wrapper A function that receives whatever values were passed to the
 * helper, and returns a React component that wraps its children.
 * @returns {SimpleHelper} A helper function that you can call to apply the given wrapper.
 */
export const createHelper =
  <Args extends unknown[]>(wrapper: SimpleWrapper<Args>): SimpleHelper<Args> =>
  (...args: Args) => ({ helperType: 'simple', wrapper, args });
