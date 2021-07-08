import React, { ReactElement } from 'react';
import { ComponentType } from 'react';

type HelperInstance = {
  wrapper: ComponentType;
};

type Helper = {
  (): HelperInstance;
  wrapper: ComponentType | null;
};

export const createHelper = (): Helper => {
  const helper: Helper = () => {
    if (helper.wrapper === null) {
      throw new Error('A helper function was never mapped to a wrapper');
    }
    return { wrapper: helper.wrapper };
  };
  helper.wrapper = null;
  return helper;
};

export const mapHelperToWrapper = (
  helper: Helper,
  wrapper: ComponentType,
): void => {
  helper.wrapper = wrapper;
};

export const wrapper = (
  ...helperInstances: HelperInstance[]
): ComponentType => {
  const wrappers = helperInstances.map((instance) => instance.wrapper);
  return composeWrappers(wrappers);
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
const composeWrappers = (wrappers: ComponentType[]): ComponentType => {
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
