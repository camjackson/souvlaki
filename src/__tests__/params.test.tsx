import { render } from '@testing-library/react';
import { createHelper, wrapper } from '..';
import {
  condense,
  TitleAndSubtitlePrefixer,
  TitlePrefixer,
  Section,
  TestComponent,
} from './fixtures';

describe('souvlaki', () => {
  it('can do a single wrapper with a single param', () => {
    const withCustomTitle = createHelper((title: string) => ({ children }) => (
      <TitlePrefixer title={title}>{children}</TitlePrefixer>
    ));

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
    const withSection = createHelper(() => Section);

    const withTitleAndSubtitle = createHelper(
      (title: string, subtitle: string) =>
        ({ children }) =>
          (
            <TitleAndSubtitlePrefixer title={title} subtitle={subtitle}>
              {children}
            </TitleAndSubtitlePrefixer>
          ),
    );

    const rendered = render(<TestComponent />, {
      wrapper: wrapper(
        withSection(),
        withTitleAndSubtitle('Primary', 'Secondary'),
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
