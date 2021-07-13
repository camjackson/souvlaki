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
