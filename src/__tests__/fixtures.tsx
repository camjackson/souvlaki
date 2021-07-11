import { PropsWithChildren } from 'react';

it('is not a real test file', () => {});

export const condense = ([str]: TemplateStringsArray) =>
  str
    .split('\n')
    .map((line) => line.trim())
    .join('');

export const TestComponent = () => <span>Oh hey!</span>;

export const Section = ({ children }: PropsWithChildren<{}>) => (
  <section>{children}</section>
);

export const TitlePrefixer = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => (
  <>
    <h1>{title}</h1>
    {children}
  </>
);

export const TitleAndSubtitlePrefixer = ({
  children,
  title,
  subtitle,
}: PropsWithChildren<{ title: string; subtitle: string }>) => (
  <>
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
    {children}
  </>
);
