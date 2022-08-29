import '@testing-library/jest-dom';
import {
  withRoute,
  withOtherRoutes,
  withLocationWatcher,
  withPathnameWatcher,
} from '..';
import { wrap } from 'souvlaki';
import { Link, useLocation, useParams } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const RouteTestComponent = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <span>Pathname: {location.pathname}</span>
      <span>ID: {id}</span>
      <span>Search: {location.search}</span>
      <Link to="/new-route">Go to new route</Link>
    </>
  );
};

describe('withRoute', () => {
  it('can provide a route with no params', () => {
    render(<RouteTestComponent />, { wrapper: wrap(withRoute('/some-page')) });

    expect(screen.getByText('Pathname: /some-page')).toBeInTheDocument();
  });

  it('can provide a route with params', () => {
    render(<RouteTestComponent />, {
      wrapper: wrap(withRoute('/users/:id', { id: 'abc123' })),
    });

    expect(screen.getByText('Pathname: /users/abc123')).toBeInTheDocument();
    expect(screen.getByText('ID: abc123')).toBeInTheDocument();
  });

  it('can provide a route with query params', () => {
    render(<RouteTestComponent />, {
      wrapper: wrap(withRoute('/some-page?q=some-search')),
    });

    expect(screen.getByText('Pathname: /some-page')).toBeInTheDocument();
    expect(screen.getByText('Search: ?q=some-search')).toBeInTheDocument();
  });

  it('can watch for pathname changes', () => {
    const onPathnameChange = jest.fn();

    render(<RouteTestComponent />, {
      wrapper: wrap(
        withRoute('/old-route'),
        withOtherRoutes(['/new-route']),
        withPathnameWatcher(onPathnameChange),
      ),
    });

    userEvent.click(screen.getByRole('link', { name: 'Go to new route' }));

    expect(onPathnameChange).toHaveBeenCalledWith('/new-route');
  });

  it('can watch for location changes', () => {
    const onLocationChange = jest.fn();

    render(<RouteTestComponent />, {
      wrapper: wrap(
        withRoute('/old-route'),
        withOtherRoutes(['/new-route']),
        withLocationWatcher(onLocationChange),
      ),
    });

    userEvent.click(screen.getByRole('link', { name: 'Go to new route' }));

    expect(onLocationChange).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: '/new-route' }),
    );
  });
});
