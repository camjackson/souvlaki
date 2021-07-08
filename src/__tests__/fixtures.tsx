import React from 'react';
import { ReactNode } from 'react';

it('is not a real test file', () => {});

type ChildrenProps = {
  children?: ReactNode;
};

export const TestComponent = () => <span>Oh hey!</span>;

export const TitleWrapper = ({ children }: ChildrenProps) => (
  <div>
    <h1>Title</h1>
    {children}
  </div>
);

export const SubtitleWrapper = ({ children }: ChildrenProps) => (
  <div>
    <h2>Subtitle</h2>
    {children}
  </div>
);
