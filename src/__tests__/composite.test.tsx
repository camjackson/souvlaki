import { render } from '@testing-library/react';
import { createHelpers, wrapper } from '..';
import { condense, TestComponent, TitleAndVotesPrefixer } from './fixtures';

describe('souvlaki', () => {
  describe('associating multiple helpers to a single wrapper', () => {
    it('adds the wrapper once if the first of two no-param helpers is used', () => {
      const [withTitle, withVotes] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title="Fixed title" votes={3}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );

      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>3 votes</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('adds the wrapper once if the second of two no-param helpers is used', () => {
      const [withTitle, withVotes] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title="Fixed title" votes={3}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );

      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withVotes()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>3 votes</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('adds the wrapper once if both no-param helpers are used', () => {
      const [withTitle, withVotes] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title="Fixed title" votes={3}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );
      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle(), withVotes()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>3 votes</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('can pass params from the first of two wrappers', () => {
      const [withTitle, withVotes] = createHelpers(
        ([title]: [string], __) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title={title} votes={3}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );
      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle('Custom title'), withVotes(5)),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Custom title</h1>
          <h2>3 votes</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('can pass params from the second of two wrappers', () => {
      const [withTitle, withVotes] = createHelpers(
        (_, [votes]: [number]) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title="Fixed title" votes={votes}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );
      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withVotes(9)),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>9 votes</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('can pass params from both wrappers', () => {
      const [withTitle, withVotes] = createHelpers(
        ([title]: [string], [votes]: [number]) =>
          ({ children }) =>
            (
              <TitleAndVotesPrefixer title={title} votes={votes}>
                {children}
              </TitleAndVotesPrefixer>
            ),
      );
      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle('Custom title'), withVotes(50)),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
        <h1>Custom title</h1>
        <h2>50 votes</h2>
        <span>Oh hey!</span>
        `,
      );
    });
  });
});
