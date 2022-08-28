import { render } from '@testing-library/react';
import { createHelper, wrap } from '..';
import {
  condense,
  Section,
  TitlePrefixer,
  TestComponent,
  TitleAndVotesPrefixer,
} from './fixtures';

describe('souvlaki', () => {
  it('creates a nothing wrapper if no wrappers are given', () => {
    const rendered = render(<TestComponent />, { wrapper: wrap() });

    expect(rendered.container.innerHTML).toEqual('<span>Oh hey!</span>');
  });

  it('can do a single wrapper with no params', () => {
    const withSection = createHelper(() => Section);

    const rendered = render(<TestComponent />, {
      wrapper: wrap(withSection()),
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
    const withSection = createHelper(() => Section);

    const withTitle = createHelper(() => ({ children }) => (
      <TitlePrefixer title="Some title">{children}</TitlePrefixer>
    ));

    const rendered = render(<TestComponent />, {
      wrapper: wrap(withSection(), withTitle()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <section>
          <h1>Some title</h1>
          <span>Oh hey!</span>
        </section>
      `,
    );
  });

  it('can do a single wrapper with a single param', () => {
    const withCustomTitle = createHelper((title: string) => ({ children }) => (
      <TitlePrefixer title={title}>{children}</TitlePrefixer>
    ));

    const rendered = render(<TestComponent />, {
      wrapper: wrap(withCustomTitle('Hello')),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <h1>Hello</h1>
        <span>Oh hey!</span>
      `,
    );
  });

  it('can do multiple wrappers with different numbers of params', () => {
    const withSection = createHelper(() => Section);

    const withTitleAndVotes = createHelper(
      (title: string, votes: number) =>
        ({ children }) =>
          (
            <TitleAndVotesPrefixer title={title} votes={votes}>
              {children}
            </TitleAndVotesPrefixer>
          ),
    );

    const rendered = render(<TestComponent />, {
      wrapper: wrap(withSection(), withTitleAndVotes('Primary', 10)),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <section>
          <h1>Primary</h1>
          <h2>10 votes</h2>
          <span>Oh hey!</span>
        </section>
      `,
    );
  });
});
