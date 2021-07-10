import { render } from '@testing-library/react';
import { createHelper, mapHelperToWrapper, wrapper } from '..';
import {
  condense,
  SectionWrapper,
  TitlePrefixer,
  TestComponent,
} from './fixtures';

describe('souvlaki', () => {
  it('creates a nothing wrapper if no wrappers are given', () => {
    const rendered = render(<TestComponent />, { wrapper: wrapper() });

    expect(rendered.container.innerHTML).toEqual('<span>Oh hey!</span>');
  });

  it('can do a single wrapper with no params', () => {
    const withSection = createHelper();
    mapHelperToWrapper(withSection, SectionWrapper);

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(withSection()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <section>
          <span>Oh hey!</span>
        </section>
      `,
    );
  });

  it('can do two wrappers with no params', () => {
    const withSection = createHelper();
    mapHelperToWrapper(withSection, SectionWrapper);

    const withTitle = createHelper();
    mapHelperToWrapper(withTitle, TitlePrefixer);

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(withSection(), withTitle()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <section>
          <h1>Title</h1>
          <span>Oh hey!</span>
        </section>
      `,
    );
  });
});
