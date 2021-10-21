import '@testing-library/jest-dom';
import { withRoute } from '..';
import { wrap } from 'souvlaki';
import { Link, useLocation, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <span>Location: {location.pathname}</span>
      <span>ID: {id}</span>
      <span>Search: {location.search}</span>
      <Link to="/new-route">Go to new route</Link>
    </>
  );
};

describe('withRoute', () => {
  it('can provide a route with no params', () => {
    render(<TestComponent />, { wrapper: wrap(withRoute('/some-page')) });

    expect(screen.getByText('Location: /some-page')).toBeInTheDocument();
  });

  it('can provide a route with params', () => {
    render(<TestComponent />, {
      wrapper: wrap(withRoute('/users/:id', { id: 'abc123' })),
    });

    expect(screen.getByText('Location: /users/abc123')).toBeInTheDocument();
    expect(screen.getByText('ID: abc123')).toBeInTheDocument();
  });

  it('can provide a route with query params', () => {
    render(<TestComponent />, {
      wrapper: wrap(withRoute('/some-page?q=some-search')),
    });

    expect(screen.getByText('Location: /some-page')).toBeInTheDocument();
    expect(screen.getByText('Search: ?q=some-search')).toBeInTheDocument();
  });

  it('can notify when the pathname changes', () => {
    const onPathnameChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(withRoute('/old-route', undefined, onPathnameChange)),
    });

    userEvent.click(screen.getByRole('link', { name: 'Go to new route' }));

    expect(onPathnameChange).toHaveBeenCalledWith('/new-route');
  });

  it('can notify when the location changes', () => {
    const onLocationChange = jest.fn();

    render(<TestComponent />, {
      wrapper: wrap(
        withRoute('/old-route', undefined, undefined, onLocationChange),
      ),
    });

    userEvent.click(screen.getByRole('link', { name: 'Go to new route' }));

    expect(onLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/new-route' }),
    );
  });
});
