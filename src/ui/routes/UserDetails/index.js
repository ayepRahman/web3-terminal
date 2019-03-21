import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo, Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import axios from 'axios';
import gql from 'graphql-tag';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Toolbar,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import { utils } from 'ethers';
import UserTokenTransferButton from 'ui/graphql/mutations/UserTokenTransferButton';
import LinearProgress from '@material-ui/core/LinearProgress';

const etherScanApiKeys = process.env.REACT_APP_ETHERSCAN_API_KEYS;

const USER_FRAGMENTS = gql`
  fragment UserFields on User {
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
`;

const GET_SINGLE_USER = gql`
  query getUser($id: ID!) {
    user(id: $id) {
      ...UserFields
    }
  }
  ${USER_FRAGMENTS}
`;

const GET_ALL_USERS_FROM_CACHE = gql`
  query getUsers($first: Int = 4, $skip: Int) {
    users(first: $first, skip: $skip) {
      ...UserFields
    }
  }
  ${USER_FRAGMENTS}
`;

const UserDetails = props => {
  const [users, setUsers] = useState([]);
  const { client, match, enqueueSnackbar } = props;
  const userId = match && match.params && match.params.id;
  // const currentUser = users.find(user => user.id === userId);

  console.log(client);

  useEffect(() => {
    getUsersFromCache();
  });

  const getUsersFromCache = async () => {
    /**
     * BUG FOUND!: readQuery can only be access when both query
     * and variables are the same as the cache data.
     * Follow up link:
     * https://github.com/apollographql/apollo-client/issues/2051#issuecomment-341696989
     */
    try {
      const { users } = client.readQuery({
        query: GET_ALL_USERS_FROM_CACHE,
      });
      setUsers(users);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getUserEthBalance = async walletAddress => {
    try {
      const response = await axios(
        `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherScanApiKeys}`,
      );
      const wei = response.data.result;
      const ethBalance = utils.formatEther(wei);
      const data = client.readQuery({ query: GET_SINGLE_USER, variables: { id: userId } });
      const userCache = data.user;

      userCache.ethBalance = ethBalance;
      client.writeQuery({
        query: GET_SINGLE_USER,
        data: {
          user: userCache, // merge data
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Query query={GET_SINGLE_USER} variables={{ id: userId }}>
      {({ loading, error, data }) => {
        const { user } = data;

        if (loading) return <LinearProgress />;

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

        getUserEthBalance(user.id);

        return (
          <Grid className="py-5" container justify="center">
            <Grid className="pb-3" item xs={5}>
              <Paper className="p-3">
                <h2 className="text-center ">User Details</h2>
                <p>
                  <b>Wallet Address</b> - {user.id}
                </p>
                {user && user.ethBalance && (
                  <p>
                    <b>Eth</b> - {user.ethBalance}
                  </p>
                )}
              </Paper>
            </Grid>
            <Grid item xs={11}>
              <Paper>
                <Toolbar>
                  <h2>User Transactions</h2>
                  <div className="ml-auto">
                    <UserTokenTransferButton id={user.id}>Send Transaction</UserTokenTransferButton>
                  </div>
                </Toolbar>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Created At</TableCell>
                      <TableCell>Exchange Address</TableCell>
                      <TableCell>Token Symbol</TableCell>
                      <TableCell>Token Amount</TableCell>
                      <TableCell>Fee (Eth)</TableCell>
                      <TableCell>Block</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user &&
                      user.txs.map(tx => (
                        <TableRow key={tx.id}>
                          <TableCell component="th" scope="tx">
                            {moment(tx.timeStamp * 1000).format('lll')}
                          </TableCell>
                          <TableCell>{tx.exchangeAddress}</TableCell>
                          <TableCell>{tx.tokenSymbol}</TableCell>
                          <TableCell>{tx.tokenAmount}</TableCell>
                          <TableCell>{tx.fee && utils.formatEther(tx.fee)}</TableCell>
                          <TableCell>{tx.block}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        );
      }}
    </Query>
  );
};

UserDetails.propTypes = {};

export default withRouter(withApollo(withSnackbar(UserDetails)));
