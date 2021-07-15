import { ComponentType } from 'react';

type CompositeWrapper<Args extends any[][]> = (...args: Args) => ComponentType;

export type CompositeHelperInstance<
  HelperArgs extends any[],
  WrapperArgs extends any[][],
> = {
  wrapper: CompositeWrapper<WrapperArgs>;
  args: HelperArgs;
  helperIndex: number;
};

type CompositeHelper<HelperArgs extends any[], WrapperArgs extends any[][]> = (
  ...args: HelperArgs
) => CompositeHelperInstance<HelperArgs, WrapperArgs>;

/**
 * Creates multiple helper functions any or all of which can be used to apply
 * the supplied wrapper.
 *
 * @param {CompositeWrapper} A function that receives multiple arrays of arguments,
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

const range = (n: number) => Array.from(Array(n).keys());
