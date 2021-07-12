import { ReactElement } from 'react';
import { ComponentType } from 'react';

type Wrapper<Args extends any[] = []> = (...args: Args) => ComponentType;
type CompositeWrapper<Args extends any[][]> = (...args: Args) => ComponentType;

type HelperInstance<Args extends any[] = []> = {
  wrapper: Wrapper<Args>;
  args: Args;
};
type CompositeHelperInstance<Args extends any[]> = HelperInstance<Args> & {
  helperIndex: number;
};

type Helper<Args extends any[] = []> = (...args: Args) => HelperInstance<Args>;
type CompositeHelper<Args extends any[] = []> = (
  ...args: Args
) => CompositeHelperInstance<Args>;

export const createHelper =
  <Args extends any[] = []>(wrapper: Wrapper<Args>): Helper<Args> =>
  (...args: Args) => ({
    wrapper,
    args,
  });

// TODO: Do this like Args1, Args2, ..., Args10?
export const createHelpers = <Args extends any[] = []>(
  wrapper: CompositeWrapper<Args[]>,
): CompositeHelper<Args>[] =>
  range(wrapper.length).map((helperIndex) => (...args: Args) => ({
    wrapper,
    args,
    helperIndex,
  }));

type InstanceArray = (HelperInstance<any> | CompositeHelperInstance<any>)[];
export const wrapper = (...helpers: InstanceArray): ComponentType => {
  // The nth wrapper in this array...
  const wrappers: Wrapper<any>[] = [];
  // Gets its args from the nth array in this array:
  const wrapperArgs: any[][] = [];

  helpers.forEach((helper) => {
    if (!wrappers.includes(helper.wrapper)) {
      wrappers.push(helper.wrapper);
      wrapperArgs.push(helper.args);
    }
  });

  const wrapperComponents = wrappers.map((wrapper, index) =>
    wrapper(...wrapperArgs[index]),
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
