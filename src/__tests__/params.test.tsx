import React from 'react';
import { render } from '@testing-library/react';
import { createHelper, mapHelperToWrapper, wrapper } from '..';
import {
  condense,
  CustomTitleAndSubtitlePrefixer,
  CustomTitlePrefixer,
  SectionWrapper,
  TestComponent,
} from './fixtures';

describe('souvlaki', () => {
  it('can do a single wrapper with a single param', () => {
    const withCustomTitle = createHelper<[string]>();
    mapHelperToWrapper(withCustomTitle, CustomTitlePrefixer);

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(withCustomTitle('Hello')),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <h1>Hello</h1>
        <span>Oh hey!</span>
      `,
    );
  });

  it('can do multiple wrappers with different numbers of args', () => {
    const withSection = createHelper();
    mapHelperToWrapper(withSection, SectionWrapper);

    const withCustomTitleAndSubtitle = createHelper<[string, string]>();
    mapHelperToWrapper(
      withCustomTitleAndSubtitle,
      CustomTitleAndSubtitlePrefixer,
    );

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(
        withSection(),
        withCustomTitleAndSubtitle('Primary', 'Secondary'),
      ),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <section>
          <h1>Primary</h1>
          <h2>Secondary</h2>
          <span>Oh hey!</span>
        </section>
      `,
    );
  });
});
