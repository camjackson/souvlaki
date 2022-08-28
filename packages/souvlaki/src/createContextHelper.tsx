import React from 'react';
import { createHelper, SimpleHelper } from './simpleWrapper';

/**
 *
 * @param {React.Context} Context A react Context (the whole Context, not the Provider or the Consumer).
 * @param defaultValue (Optional) A default value for the context, set when the helper is created
 * @returns {SimpleHelper} A helper function that you can call to apply the given context wrapper.
 */

// In this version the value is not given at creation, and must be given when wrapping
function createContextHelper<ContextValue>(
  Context: React.Context<ContextValue>,
): SimpleHelper<[value: ContextValue]>;

// In this version the value is given at creation, and *can* be overriden when wrapping
function createContextHelper<ContextValue>(
  Context: React.Context<ContextValue>,
  defaultValue: ContextValue,
): SimpleHelper<[value?: ContextValue]>;

// And finally this signature unites the two, with the value optional in both places
function createContextHelper<ContextValue>(
  Context: React.Context<ContextValue>,
  defaultValue?: ContextValue,
): SimpleHelper<[value: ContextValue]> | SimpleHelper<[value?: ContextValue]> {
  return createHelper((value) => ({ children }) => (
    // Between the two signatures above, the value must have been provided either
    // at creation or when wrapping, so we can safely `as` here, removing the undefined
    <Context.Provider value={(value ?? defaultValue) as ContextValue}>
      {children}
    </Context.Provider>
  ));
}

export { createContextHelper };
