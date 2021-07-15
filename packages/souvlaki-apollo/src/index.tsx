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

export const withApollo = createHelper(
  (client?: ApolloClient<any>): React.ComponentType =>
    ({ children }) =>
      (
        <ApolloProvider client={client || createDefaultClient()}>
          {children}
        </ApolloProvider>
      ),
);
