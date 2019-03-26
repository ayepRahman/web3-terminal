import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { utils } from 'ethers';
import { Query, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

import {
  Grid,
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  Paper,
  DialogActions,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import routeTemplates from 'ui/routes/templates';
import getUserEthBalance from 'utils/ethereum/getUserEthBalance';

import './index.scss';

/**
 * TODO:
 *  fetch more using client instead of mutation
 *  ensure the updated eth value is update and does not get merge with the new fetch when user redirect back to home page
 *  use table instead of card
 */

const GET_USERS = gql`
  query getUsers($first: Int, $skip: Int) {
    users(first: $first, skip: $skip) {
      id
      exchangeBalances {
        id
        userAddress
        exchangeAddress
        ethDeposited
        tokensDeposited
        uniTokensMinted
        uniTokensBurned
        ethWithdrawn
        tokensWithdrawn
        ethBought
        tokensBought
        totalEthFeesPaid
        totalTokenFeesPaid
      }
      txs {
        id
        event
        block
        timeStamp
        exchangeAddress
        tokenSymbol
        userAddress
        ethAmount
        tokenAmount
        fee
      }
    }
  }
`;

const GET_ALL_USERS_STATE = gql`
  query getAllUsers {
    store @client {
      users
    }
  }
`;

const UPDATE_USERS_STATE = gql`
  mutation updateUsers($users: [User]) {
    updateUsers(users: $users) @client
  }
`;

const UsersLists = props => {
  const { enqueueSnackbar, history, client } = props;
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetching(true);

    try {
      const response = await client.query({
        query: GET_USERS,
        variables: {
          first: 20,
        },
      });
      console.log('response', response);
      const users = response && response.data && response.data.users;

      users.forEach(user => {
        const userEthBalance = getUserEthBalance(user.id);
        user.ethBalance = userEthBalance;
      });

      console.log('USERS', users);

      await updateUsersState(users);
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        action: (
          <Button color="default" variant="flat" size="small">
            Close
          </Button>
        ),
      });
    }
  };

  const updateUsersState = async users => {
    try {
      const { getAllUsers } = await client.query({
        query: GET_ALL_USERS_STATE,
      });

      const updatedUsers = [...getAllUsers.users, ...users];

      await client.mutate({
        mutation: UPDATE_USERS_STATE,
        variables: {
          updatedUsers,
        },
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        action: (
          <Button color="default" variant="flat" size="small">
            Close
          </Button>
        ),
      });
    }
  };

  if (fetching) return <LinearProgress />;

  return (
    <Grid className="py-5" container justify="center">
      <Grid item xs={10} md={8}>
        <h1>Users Lists</h1>
      </Grid>

      <Grid item xs={10} md={8}>
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
            <Grid className="pt-5 text-center" item xs={12}>
              <CircularProgress />
            </Grid>
          }
        >
          <Grid container spacing={32}>
            {data &&
              data.users &&
              data.users.map((user, index) => {
                getUserEthBalance(user.id, updateQuery);

                if (!user.ethBalance) {
                  return (
                    <Grid key={index} item xs={12} md={6}>
                      <Paper className="p-5 text-center">
                        <CircularProgress />
                      </Paper>
                    </Grid>
                  );
                }

                return (
                  <Grid key={index} item xs={12} md={6}>
                    <Card>
                      <CardActionArea
                        onClick={() =>
                          history.push(`${routeTemplates.user.root}/${user.id}`, { user })
                        }
                      >
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

                            {user.ethBalance && (
                              <li>
                                <b>Ether Balance: </b> {user.ethBalance}
                              </li>
                            )}
                          </ul>
                        </CardContent>
                      </CardActionArea>
                      <CardActions>
                        <DialogActions className="ml-auto">
                          <Button
                            size="small"
                            onClick={() =>
                              history.push(`${routeTemplates.user.root}/${user.id}`, { user })
                            }
                          >
                            View More
                          </Button>
                        </DialogActions>
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
};

export default withRouter(withApollo(withSnackbar(UsersLists)));
