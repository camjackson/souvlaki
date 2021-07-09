import React from 'react';
import { render } from '@testing-library/react';
import { createHelper, mapHelperToWrapper, wrapper } from '..';
import { SubtitleWrapper, TestComponent, TitleWrapper } from './fixtures';

const condense = ([str]: TemplateStringsArray) =>
  str
    .split('\n')
    .map((line) => line.trim())
    .join('');

describe('souvlaki', () => {
  it('creates a nothing wrapper if no wrappers are given', () => {
    const rendered = render(<TestComponent />, { wrapper: wrapper() });

    expect(rendered.container.innerHTML).toEqual('<span>Oh hey!</span>');
  });

  it('can do a single wrapper with no params', () => {
    const withTitle = createHelper();
    mapHelperToWrapper(withTitle, TitleWrapper);

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(withTitle()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <div>
          <h1>Title</h1>
          <span>Oh hey!</span>
        </div>
      `,
    );
  });

  it('can do two wrappers with no params', () => {
    const withTitle = createHelper();
    mapHelperToWrapper(withTitle, TitleWrapper);

    const withSubtitle = createHelper();
    mapHelperToWrapper(withSubtitle, SubtitleWrapper);

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(withTitle(), withSubtitle()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <div>
          <h1>Title</h1>
          <div>
            <h2>Subtitle</h2>
            <span>Oh hey!</span>
          </div>
        </div>
      `,
    );
  });
});
