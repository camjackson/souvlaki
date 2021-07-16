import { ComponentType } from 'react';

/**
 * A function that takes args collected by multiple helpers, and returns a React component.
 */
type CompositeWrapper<Args extends any[][]> = (...args: Args) => ComponentType;

/**
 * An instantiated helper from a composite wrapper, to be passed to `wrap`.
 */
export type CompositeHelperInstance<
  HelperArgs extends any[],
  WrapperArgs extends any[][],
> = {
  wrapper: CompositeWrapper<WrapperArgs>;
  args: HelperArgs;
  helperIndex: number;
};

/**
 * A function that takes args for a composite wrapper and returns a helper instance.
 */
type CompositeHelper<HelperArgs extends any[], WrapperArgs extends any[][]> = (
  ...args: HelperArgs
) => CompositeHelperInstance<HelperArgs, WrapperArgs>;

/**
 * Creates multiple helper functions any or all of which can be used to apply
 * the supplied wrapper.
 *
 * @param {CompositeWrapper} wrapper A function that receives multiple arrays of arguments,
 * each one being populated (or not) with the values passed to a corresponding helper.
 * It returns a React component that wraps its children.
 * @returns {Helper[]} An array of helper functions that you can call to apply the given wrapper.
 */
export const createHelpers = <WrapperArgs extends any[][]>(
  wrapper: CompositeWrapper<WrapperArgs>,
): {
  [Index in keyof WrapperArgs]: CompositeHelper<
    // @ts-ignore
    WrapperArgs[Index],
    WrapperArgs
  >;
} =>
  range(wrapper.length).map((helperIndex) => (...args: any[]) => ({
    wrapper,
    args,
    helperIndex,
  })) as any;

/**
 * E.g. range(3) -> [0, 1, 2]
 */
const range = (n: number) => Array.from(Array(n).keys());
