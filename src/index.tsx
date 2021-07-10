import { ReactElement } from 'react';
import { ComponentType } from 'react';

type Wrapper<Args extends any[] = []> = (...args: Args) => ComponentType;

type HelperInstance<Args extends any[] = []> = {
  wrapper: Wrapper<Args>;
  args: Args;
};

type Helper<Args extends any[] = []> = {
  (...args: Args): HelperInstance<Args>;
  wrapper: Wrapper<Args> | null;
};

export const createHelper = <Args extends any[] = []>(): Helper<Args> => {
  const helper: Helper<Args> = (...args) => {
    if (helper.wrapper === null) {
      throw new Error('A helper function was never mapped to a wrapper');
    }
    const helperInstance: HelperInstance<Args> = {
      wrapper: helper.wrapper,
      args,
    };
    return helperInstance;
  };
  helper.wrapper = null;
  return helper;
};

export const mapHelperToWrapper = <Args extends any[] = []>(
  helper: Helper<Args>,
  wrapper: Wrapper<Args>,
): void => {
  helper.wrapper = wrapper;
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
