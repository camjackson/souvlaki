import { PropsWithChildren } from 'react';

it('is not a real test file', () => {});

export const condense = ([str]: TemplateStringsArray) =>
  str
    .split('\n')
    .map((line) => line.trim())
    .join('');

export const TestComponent = () => <span>Oh hey!</span>;

export const SectionWrapper =
  () =>
  ({ children }: PropsWithChildren<{}>) =>
    <section>{children}</section>;

export const TitlePrefixer =
  () =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <>
        <h1>Title</h1>
        {children}
      </>
    );

export const CustomTitlePrefixer =
  (title: string) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <>
        <h1>{title}</h1>
        {children}
      </>
    );

export const CustomTitleAndSubtitlePrefixer =
  (title: string, subtitle: string) =>
  ({ children }: PropsWithChildren<{}>) =>
    (
      <>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
        {children}
      </>
    );
