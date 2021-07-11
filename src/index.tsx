import { ReactElement } from 'react';
import { ComponentType } from 'react';

type Wrapper<Args extends any[] = []> = (...args: Args) => ComponentType;

type HelperInstance<Args extends any[] = []> = {
  wrapper: Wrapper<Args>;
  args: Args;
};

type Helper<Args extends any[] = []> = (...args: Args) => HelperInstance<Args>;

export const createHelper = <Args extends any[] = []>(
  wrapper: Wrapper<Args>,
): Helper<Args> => {
  return (...args: Args) => ({
    wrapper,
    args,
  });
};

export const wrapper = (
  ...helperInstances: HelperInstance<any>[]
): ComponentType => {
  const wrapperComponents = helperInstances.map((instance) =>
    instance.wrapper(...instance.args),
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
