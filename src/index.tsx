import React from 'react';
import { ComponentType } from 'react';

type Helper = {};

export const createHelper = <T,>(...args: T[]) => {};

export const mapHelpersToWrapper = (helpers: Helper[]) => {
  //
};

export const wrapper = (...helpers: Helper[]): ComponentType => {
  return composeWrappers([]);
};

const composeWrappers = (wrappers: ComponentType[]): ComponentType => {
  return ({ children }) => <>{children}</>;
};
