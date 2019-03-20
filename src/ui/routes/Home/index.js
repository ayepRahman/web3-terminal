import React, { Component, Fragment, useEffect } from 'react';
import { Query, withApollo } from 'react-apollo';
import { Grid, Card, CardActions } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import gql from 'graphql-tag';
import logo from './logo.svg';
import './index.scss';

const GET_USERS = gql`
  query getUsers($first: Int!) {
    users(first: $first) {
      id
      exchangeBalances {
        userAddress
        ethWithdrawn
        exchangeAddress
        tokensWithdrawn
        totalEthFeesPaid
        totalTokenFeesPaid
      }
      txs {
        id
        timeStamp
        ethAmount
        tokenAmount
        userAddress
        exchangeAddress
      }
    }
  }
`;

const Home = props => {
  console.log(props);

  return (
    <Query query={GET_USERS} variables={{ first: 20 }}>
      {({ loading, error, data }) => {
        if (loading) return <LinearProgress color="primary" />;

        console.log(data);
        return (
          <div className="Home">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <ul />
            </header>
          </div>
        );
      }}
    </Query>
  );
};

export default withApollo(Home);
