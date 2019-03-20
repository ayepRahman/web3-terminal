import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SnackbarProvider } from 'notistack';

import 'styles/index.scss';
import App from 'ui/app';
import * as serviceWorker from './serviceWorker';

// for the sake of demo, i wont be adding this to env var
const uniSwapUri = 'https://api.thegraph.com/subgraphs/name/graphprotocol/uniswap';

const client = new ApolloClient({
  link: new HttpLink({
    uri: uniSwapUri,
  }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
