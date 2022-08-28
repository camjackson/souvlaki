import { ReactElement } from 'react';
import { createContextHelper } from './createContextHelper';
import {
  createHelper,
  SimpleHelper,
  SimpleHelperInstance,
  SimpleWrapper,
} from './simpleWrapper';
import {
  createHelpers,
  CompositeHelper,
  CompositeHelperInstance,
  CompositeWrapper,
} from './compositeWrapper';
import { ReactComponent } from './util';

type InstanceArray = (
  | SimpleHelperInstance<any>
  | CompositeHelperInstance<any, any>
)[];

export {
  createHelper,
  createHelpers,
  createContextHelper,
  SimpleHelper,
  SimpleHelperInstance,
  SimpleWrapper,
  CompositeHelper,
  CompositeHelperInstance,
  CompositeWrapper,
  ReactComponent,
};

/**
 * Composes the given helper instances together to create a React component
 * that you can wrap around other components.
 *
 * @param {...SimpleHelperInstance} ...helpers A variable number of instantiated helpers.
 * @returns {ReactComponent} A React.js component to wrap around other components.
 */
export const wrap = (...helpers: InstanceArray): ReactComponent => {
  const wrapperToItsArgsMap: Map<SimpleWrapper<any>, any[]> = new Map();

  helpers.forEach((helper) => {
    const { helperType, wrapper, args } = helper;
    const wrapperAlreadyInMap = wrapperToItsArgsMap.has(wrapper);

    if (helperType === 'simple') {
      // It's a non-composite wrapper - make sure it's not a dupe, then just push it
      if (wrapperAlreadyInMap) {
        throw new Error(`Duplicate helper detected: ${wrapper.toString()}`);
      }
      wrapperToItsArgsMap.set(wrapper, args);
    } else if (helperType === 'composite') {
      // It's a composite wrapper, so...
      // ... add it to the list, with empty args, if it's not already there...
      if (!wrapperAlreadyInMap) {
        wrapperToItsArgsMap.set(wrapper, nEmptyArrays(wrapper.length));
      }
      // ... and then set the args from this instance into the right slot
      wrapperToItsArgsMap.get(wrapper)![helper.helperIndex] = args;
    } else {
      throw new Error(`Unexpected value for helperType: "${helperType}".
      This is a bug in souvlaki, please report it here: https://github.com/camjackson/souvlaki/issues/new`);
    }
  });

  // Apply all the collected args to all of the wrappers, both simple and composite,
  // creating an array of React components that can now be composed together.
  const wrapperComponents = Array.from(wrapperToItsArgsMap).map(
    ([wrapper, args]) => wrapper(...args),
  );

  return composeComponents(wrapperComponents);
};

/**
 * @param {ReactComponent} wrappers e.g.: `[WrapperA, WrapperB, WrapperC]`
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
const composeComponents = (wrappers: ReactComponent[]): ReactComponent => {
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

/**
 * E.g. nEmptyArrays(3) -> [[], [], []]
 */
const nEmptyArrays = (n: number) => Array(n).fill([]);
