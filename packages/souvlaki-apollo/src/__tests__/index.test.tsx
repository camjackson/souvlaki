import '@testing-library/jest-dom';
import fetch from 'cross-fetch';
import { withApollo } from '..';
import { wrap } from 'souvlaki';
import { useApolloClient } from '@apollo/client';
import { render, screen } from '@testing-library/react';

window.fetch = fetch;

const TestComponent = () => {
  const client = useApolloClient();

  if (client) {
    return <span>Yay a client!</span>;
  }

  return <span>No client :(</span>;
};

describe('withApollo', () => {
  it('wraps the provided component in an apollo provider', () => {
    render(<TestComponent />, { wrapper: wrap(withApollo()) });

    expect(screen.getByText('Yay a client!')).toBeInTheDocument();
  });
});
