import { render, screen } from '@testing-library/react';
import { createContext, useContext } from 'react';
import { createContextHelper, wrap } from '..';
import { condense } from './fixtures';

type User = {
  name: string;
};

const UserContext = createContext<User | null>(null);

const UserProfile = () => {
  const user = useContext(UserContext);

  if (!user) {
    return <span>Not logged in</span>;
  }

  return <span>User: {user.name}</span>;
};

describe('createContextHelper', () => {
  it('can apply the context with the value at creation time', () => {
    const withUser = createContextHelper(UserContext, { name: 'Cam Jackson' });

    const rendered = render(<UserProfile />, { wrapper: wrap(withUser()) });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <span>User: Cam Jackson</span>
      `,
    );
  });

  it('can apply the context with the value at wrapping time', () => {
    const withUser = createContextHelper(UserContext);

    const rendered = render(<UserProfile />, {
      wrapper: wrap(withUser({ name: 'Cam Jackson' })),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <span>User: Cam Jackson</span>
      `,
    );
  });

  it('should give a type error', () => {
    const withUser = createContextHelper(UserContext);

    const rendered = render(<UserProfile />, {
      // @ts-expect-error
      wrapper: wrap(withUser()),
    });

    expect(rendered.container.innerHTML).toEqual(
      condense`
        <span>Not logged in</span>
      `,
    );
  });
});
