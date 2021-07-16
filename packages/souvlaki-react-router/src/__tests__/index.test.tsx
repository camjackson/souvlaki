import '@testing-library/jest-dom';
import { withRoute } from '..';
import { wrap } from 'souvlaki';
import { useLocation, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

const TestComponent = () => {
  const location = useLocation();
  const { id } = useParams();

  return (
    <>
      <span>Current location is: {location.pathname}</span>
      <span>Current id is: {id}</span>
    </>
  );
};

describe('withRoute', () => {
  it('can provide a route with no params', () => {
    render(<TestComponent />, { wrapper: wrap(withRoute('/some-page')) });

    expect(
      screen.getByText('Current location is: /some-page'),
    ).toBeInTheDocument();
  });

  it('can provide a route with params', () => {
    render(<TestComponent />, {
      wrapper: wrap(withRoute('/users/:id', { id: 'abc123' })),
    });

    expect(
      screen.getByText('Current location is: /users/abc123'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current id is: abc123')).toBeInTheDocument();
  });
});
