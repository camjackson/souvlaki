import '@testing-library/jest-dom';
import { withRoute } from '..';
import { wrap } from 'souvlaki';
import { Link, useLocation, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Location } from 'history';

const TestComponent = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <span>Current location is: {location.pathname}</span>
      <span>Current id is: {id}</span>
      <Link to="/new-route">Go to new route</Link>
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

  it('can notify when the location changes', () => {
    const onLocationChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(withRoute('/old-route', {}, onLocationChange)),
    });

    userEvent.click(screen.getByRole('link', { name: 'Go to new route' }));

    expect(onLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/new-route' }),
    );
  });
});
