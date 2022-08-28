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
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <>
    <h1>{title}</h1>
    {children}
  </>
);

export const TitleAndVotesPrefixer = ({
  title,
  votes,
  children,
}: PropsWithChildren<{ title: string; votes: number }>) => (
  <>
    {title && <h1>{title}</h1>}
    {votes && <h2>{votes} votes</h2>}
    {children}
  </>
);
