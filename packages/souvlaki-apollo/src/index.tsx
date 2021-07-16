import { createHelper } from 'souvlaki';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import React from 'react';

const createDefaultClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink(),
  });

/**
 * A helper you can call to apply an ApolloProvider wrapper to your components.
 * @param {ApolloClient} client An optional custom ApolloClient to be used. If none is
 * given, a default one is create with an HttpLink and an InMemoryCache.
 * @returns {HelperInstance} To be passed to `souvlaki.wrap()`
 */
export const withApollo = createHelper(
  (client?: ApolloClient<any>): React.ComponentType =>
    ({ children }) =>
      (
        <ApolloProvider client={client || createDefaultClient()}>
          {children}
        </ApolloProvider>
      ),
);
