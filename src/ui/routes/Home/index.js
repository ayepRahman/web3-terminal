import React from 'react';
import axios from 'axios';
import { utils } from 'ethers';
import { Query, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import {
  Grid,
  Card,
  CardActions,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  Paper,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import routeTemplates from 'ui/routes/templates';

import gql from 'graphql-tag';
import './index.scss';

const etherScanApiKeys =
  process.env.REACT_APP_ETHERSCAN_API_KEYS || 'C852K7V62PDKJ5AG3VRQCIRX55ZAWC8NWF';

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

const Home = props => {
  const { enqueueSnackbar, history } = props;

  const getUserEthBalance = async (walletAddress, updateQuery) => {
    try {
      const response = await axios(
        `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherScanApiKeys}`,
      );

      const wei = response.data.result;
      const ethBalance = utils.formatEther(wei);

      updateQuery(prevResult => {
        const { users } = prevResult;
        const updatedUsersArray =
          users &&
          users.map(user => {
            if (user.id === walletAddress) {
              user.ethBalance = ethBalance;
              return user;
            }

            return user;
          });
        const returnObj = Object.assign({}, prevResult, {
          users: updatedUsersArray,
        });

        return returnObj;
      });
    } catch (error) {
      console.log(error.message);
    }
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
          <Grid className="py-5" container justify="center">
            <Grid item xs={10} md={6}>
              <Paper className="py-3 mb-3 text-center">
                <h1>Web3 Terminal</h1>
              </Paper>
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
                      getUserEthBalance(user.id, updateQuery);
                      console.log(user);
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
                              <Button
                                size="small"
                                onClick={() =>
                                  history.push(`${routeTemplates.user.root}/${user.id}`, { user })
                                }
                              >
                                View More
                              </Button>
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

export default withRouter(withApollo(withSnackbar(Home)));
