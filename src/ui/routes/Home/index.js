import React, { Component, Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import { Query, withApollo } from 'react-apollo';
import {
  Grid,
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import gql from 'graphql-tag';

import './index.scss';
import { argumentsObjectFromField } from 'apollo-utilities';

// for the sake of agile, not storing this in an .env
const etherScanApiKeys = 'C852K7V62PDKJ5AG3VRQCIRX55ZAWC8NWF';

const GET_USERS = gql`
  query getUsers($first: Int, $skip: Int) {
    users(first: $first, skip: $skip) {
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
  const { enqueueSnackbar } = props;
  const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/'));

  const getUserEthBalance = async walletAddress => {
    const response = await axios(
      `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherScanApiKeys}`,
    );

    const wei = response.data.result;
    console.log('WEI', wei);

    const ethBalance = await web3.utils.fromWei(wei, 'ether');

    console.log('ethBalance', ethBalance);

    return ethBalance;
  };

  return (
    <Query query={GET_USERS} variables={{ first: 4 }}>
      {({ loading, error, data, fetchMore, updateQuery }) => {
        if (loading) return <LinearProgress color="primary" />;

        if (error) {
          enqueueSnackbar(error.message, {
            variant: 'error',
            action: (
              <Button color="default" variant="flat" size="small">
                {'Dismiss'}
              </Button>
            ),
          });
        }

        return (
          <Grid className="home" container justify="center">
            <Grid className="text-center pb-3" item xs={12}>
              <h1>Web3 Terminal</h1>
            </Grid>

            <Grid item xs={6}>
              <InfiniteScroll
                pageStart={0}
                loadMore={() => {
                  fetchMore({
                    variables: {
                      skip: 4,
                    },
                    updateQuery: (prevResult, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prevResult;
                      return Object.assign({}, prevResult, {
                        users: [...prevResult.users, ...fetchMoreResult.users],
                      });
                    },
                  });
                }}
                hasMore={true}
                loader={
                  <Grid className="pt-5" item xs={12}>
                    <LinearProgress color="primary" />
                  </Grid>
                }
              >
                <Grid container spacing={32}>
                  {data &&
                    data.users &&
                    data.users.map((user, index) => {
                      return (
                        <Grid key={index} item xs={6}>
                          <Card>
                            <CardActionArea>
                              <CardMedia
                                component="img"
                                className="card"
                                title="Crypto"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTARCA3a8h3USjmdXWmistANmWf5Q1VSebtQHWAzyfwJ-a-_ApouQ"
                              />
                              <CardContent>
                                <ul>
                                  <li>
                                    <b>User Id/Address:</b> {user.id}
                                  </li>
                                  <li>
                                    <b>Ether Balance:</b> {getUserEthBalance(user.id)}
                                  </li>
                                </ul>
                              </CardContent>
                            </CardActionArea>
                            <CardActions>
                              <Button size="small">View More</Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      );
                    })}
                </Grid>
              </InfiniteScroll>
            </Grid>
          </Grid>
        );
      }}
    </Query>
  );
};

export default withApollo(withSnackbar(Home));
