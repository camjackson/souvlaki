import { render } from '@testing-library/react';
import { createHelpers, wrapper } from '..';
import { condense, TestComponent, TitleAndSubtitlePrefixer } from './fixtures';

describe('souvlaki', () => {
  describe('associating multiple helpers to a single wrapper', () => {
    it('adds the wrapper once if the first of two no-param helpers is used', () => {
      const [withTitle, withSubtitle] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndSubtitlePrefixer
                title="Fixed title"
                subtitle="Fixed subtitle"
              >
                {children}
              </TitleAndSubtitlePrefixer>
            ),
      );

      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>Fixed subtitle</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('adds the wrapper once if the second of two no-param helpers is used', () => {
      const [withTitle, withSubtitle] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndSubtitlePrefixer
                title="Fixed title"
                subtitle="Fixed subtitle"
              >
                {children}
              </TitleAndSubtitlePrefixer>
            ),
      );

      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withSubtitle()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>Fixed subtitle</h2>
          <span>Oh hey!</span>
        `,
      );
    });

    it('adds the wrapper once if both no-param helpers are used', () => {
      const [withTitle, withSubtitle] = createHelpers(
        (_, __) =>
          ({ children }) =>
            (
              <TitleAndSubtitlePrefixer
                title="Fixed title"
                subtitle="Fixed subtitle"
              >
                {children}
              </TitleAndSubtitlePrefixer>
            ),
      );
      const rendered = render(<TestComponent />, {
        wrapper: wrapper(withTitle(), withSubtitle()),
      });

      expect(rendered.container.innerHTML).toEqual(
        condense`
          <h1>Fixed title</h1>
          <h2>Fixed subtitle</h2>
          <span>Oh hey!</span>
        `,
      );
    });
  });
});
