import { ComponentType } from 'react';

export type Wrapper<Args extends any[]> = (...args: Args) => ComponentType;

export type HelperInstance<Args extends any[]> = {
  wrapper: Wrapper<Args>;
  args: Args;
};

type Helper<Args extends any[]> = (...args: Args) => HelperInstance<Args>;

export const createHelper =
  <Args extends any[]>(wrapper: Wrapper<Args>): Helper<Args> =>
  (...args: Args) => ({
    wrapper,
    args,
  });
