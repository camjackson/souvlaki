import { render } from '@testing-library/react';
import { createHelper, wrap } from '..';
import {
  condense,
  TitleAndVotesPrefixer,
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
      wrapper: wrap(withCustomTitle('Hello')),
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
