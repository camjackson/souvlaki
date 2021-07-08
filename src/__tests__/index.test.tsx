import React from 'react';
import { render } from '@testing-library/react';
import { createHelper, wrapper } from '..';

describe('souvlaki', () => {
  it('creates a nothing wrapper if no wrappers are given', () => {
    const MyComponent = () => <div>Oh hey!</div>;

    const rendered = render(<MyComponent />, { wrapper: wrapper() });

    expect(rendered.container.innerHTML).toEqual('<div>Oh hey!</div>');
  });

  it('works', () => {
    const withSomething = () => createHelper();
    const withSomethingElse = (value: number) => createHelper(value);
  });
});
