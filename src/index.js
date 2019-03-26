import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider } from '@material-ui/core';

// APOLLO CLIENTSTATE
import { defaults } from 'ui/apollo/defaults';
import { resolvers } from 'ui/apollo/resolvers';

import 'styles/index.scss';
import { theme } from 'styles/theme';

import App from 'ui/app';
import * as serviceWorker from './serviceWorker';

const uniSwapUri =
  process.env.REACT_APP_UNISWAP_URL ||
  'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap';
const apolloCache = new InMemoryCache();

/**
 * Conclusion to apollo client direct cache, very BUGGY!
 * BUG FOUND!: readQuery can only be access when both query
 * and variables are the same as the cache data.
 * Follow up link:
 * https://github.com/apollographql/apollo-client/issues/2051#issuecomment-341696989
 * Solution: Use apollo client state state instead =)
 */

const clientStateLink = withClientState({
  resolvers,
  defaults,
  cache: apolloCache,
});

const httpLink = new HttpLink({
  uri: uniSwapUri,
});

const combineLinks = ApolloLink.from([clientStateLink, httpLink]);

const client = new ApolloClient({
  link: combineLinks,
  cache: apolloCache,
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </MuiThemeProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
