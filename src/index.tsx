import { ReactElement } from 'react';
import { ComponentType } from 'react';

type Wrapper<Args extends any[]> = (...args: Args) => ComponentType;
type CompositeWrapper<Args extends any[][]> = (...args: Args) => ComponentType;

type HelperInstance<Args extends any[]> = {
  wrapper: Wrapper<Args>;
  args: Args;
};
type CompositeHelperInstance<
  HelperArgs extends any[],
  WrapperArgs extends any[][],
> = {
  wrapper: CompositeWrapper<WrapperArgs>;
  args: HelperArgs;
  helperIndex: number;
};

type Helper<Args extends any[]> = (...args: Args) => HelperInstance<Args>;
type CompositeHelper<HelperArgs extends any[], WrapperArgs extends any[][]> = (
  ...args: HelperArgs
) => CompositeHelperInstance<HelperArgs, WrapperArgs>;

export const createHelper =
  <Args extends any[]>(wrapper: Wrapper<Args>): Helper<Args> =>
  (...args: Args) => ({
    wrapper,
    args,
  });

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

type InstanceArray = (
  | HelperInstance<any>
  | CompositeHelperInstance<any, any>
)[];
export const wrapper = (...helpers: InstanceArray): ComponentType => {
  const wrapperToItsArgsMap: Map<Wrapper<any>, any[]> = new Map();

  helpers.forEach((helper) => {
    const helperIndex = (helper as CompositeHelperInstance<any, any>)
      .helperIndex;
    const wrapperAlreadyInMap = wrapperToItsArgsMap.has(helper.wrapper);

    if (helperIndex === undefined) {
      // It's a non-composite wrapper, just push it if it's not there already
      if (wrapperAlreadyInMap) {
        throw new Error(
          `Duplicate helper detected: ${helper.wrapper.toString()}`,
        );
      }
      wrapperToItsArgsMap.set(helper.wrapper, helper.args);
    } else {
      // It's a composite wrapper, so...
      // ... add it to the list, with empty args, if it's not already there...
      if (!wrapperAlreadyInMap) {
        wrapperToItsArgsMap.set(
          helper.wrapper,
          nEmptyArrays(helper.wrapper.length),
        );
      }
      // ... and then set the args from this instance into the right slot
      wrapperToItsArgsMap.get(helper.wrapper)![helperIndex] = helper.args;
    }
  });

  const wrapperComponents = Array.from(wrapperToItsArgsMap).map(
    ([wrapper, args]) => wrapper(...args),
  );

  return composeComponents(wrapperComponents);
};

/**
 * @param wrappers, e.g.: `[WrapperA, WrapperB, WrapperC]`
 * @returns a React component that wraps its children in each wrapper
 * in the given order, e.g.:
 * ({ children }) => (
 *   <WrapperA>
 *     <WrapperB>
 *       <WrapperC>
 *         {children}
 *       </WrapperC>
 *     </WrapperB>
 *   </WrapperA>
 * )
 * Note: It mutates its argument, reversing its order
 */
const composeComponents = (wrappers: ComponentType[]): ComponentType => {
  if (wrappers.length === 0) {
    return ({ children }) => <>{children}</>;
  }

  return ({ children }) =>
    wrappers
      .reverse()
      .reduce(
        (previousChildren, NextWrapper) => (
          <NextWrapper>{previousChildren}</NextWrapper>
        ),
        children,
      ) as ReactElement;
};

const range = (n: number) => Array.from(Array(n).keys());
const nEmptyArrays = (n: number) => Array(n).fill([]);
