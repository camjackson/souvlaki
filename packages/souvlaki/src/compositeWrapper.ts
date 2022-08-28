import { ReactComponent } from './util';

/**
 * A function that takes a 2D array of args, collected by multiple helpers, and returns a React component.
 * This is the double-arrow function that is passed into `createHelpers`.
 */
export type CompositeWrapper<Args extends unknown[][]> = (
  ...args: Args
) => ReactComponent;

/**
 * An instantiated helper from a composite wrapper, to be passed to `wrap`.
 * This is the object returned by calling `withWhatever(someArgs)`.
 * It contains the wrapper function, the args given to this instance of it,
 * and the index of this helper within the array of helpers that make up the composite
 */
export type CompositeHelperInstance<
  HelperArgs extends unknown[], // The args of this function within the helper
  WrapperArgs extends unknown[][], // The args of the whole composite hlper
> = {
  helperType: 'composite';
  wrapper: CompositeWrapper<WrapperArgs>;
  args: HelperArgs;
  helperIndex: number;
};

/**
 * A function that takes args for a composite wrapper and returns a helper instance.
 * These are the functions that are created and returned, as an array, by `createHelpers`.
 */
export type CompositeHelper<
  HelperArgs extends unknown[],
  WrapperArgs extends unknown[][],
> = (...args: HelperArgs) => CompositeHelperInstance<HelperArgs, WrapperArgs>;

/**
 * Creates multiple helper functions any or all of which can be used to apply
 * the supplied wrapper.
 *
 * @param {CompositeWrapper} wrapper A function that receives multiple arrays of arguments,
 * each one being populated (or not) with the values passed to a corresponding helper.
 * It returns a React component that wraps its children.
 * @returns {CompositeHelper[]} An array of helper functions that you can call to apply the given wrapper.
 * You can use any number of them, and the wrapper will be applied once only,
 * with all of the arguments that were provided to all of the helpers.
 */
export const createHelpers = <WrapperArgs extends unknown[][]>(
  wrapper: CompositeWrapper<WrapperArgs>,
): {
  // This is an array whose keys (i.e. length) matches the args array-of-arrays
  [Index in keyof WrapperArgs]: CompositeHelper<
    WrapperArgs[Index],
    WrapperArgs
  >;
} =>
  range(wrapper.length).map((helperIndex) => (...args: unknown[]) => ({
    helperType: 'composite',
    wrapper,
    args,
    helperIndex,
  })) as any; // TODO: Fix?

/**
 * E.g. range(3) -> [0, 1, 2]
 */
const range = (n: number) => Array.from(Array(n).keys());
