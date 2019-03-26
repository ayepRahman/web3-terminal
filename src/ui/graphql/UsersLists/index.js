import React, { useEffect, useState } from 'react';
import { Query, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { useWeb3Context } from 'web3-react';

import {
  Grid,
  Button,
  Paper,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import InfiniteScroll from 'react-infinite-scroller';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';

import routeTemplates from 'ui/routes/templates';
import { GET_ALL_USERS_STATE, GET_USERS, UPDATE_USERS_STATE } from './gql';

import './index.scss';

/**
 * TODO:
 *  fetch more using client instead of mutation
 *  ensure the updated eth value is update and does not get merge with the new fetch when user redirect back to home page
 *  use table instead of card
 */

const UsersLists = props => {
  const web3Context = useWeb3Context();
  const { setConnector, library } = web3Context;
  const { enqueueSnackbar, history, client } = props;
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState(false);

  useEffect(() => {
    setConnector('infura'); // setting up which connector to connect
  }, []);

  useEffect(() => {
    if (library) {
      fetchUsers();
    }
  }, [library]);

  console.log(web3Context);

  const fetchUsers = async () => {
    try {
      const response = await client.query({
        query: GET_USERS,
        variables: {
          first: 5,
        },
      });
      const users = response && response.data && response.data.users;
      updateUsersState(users);
    } catch (error) {
      debugger;
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

  const fetchMoreUsers = async value => {
    console.log('value', value);

    try {
      const response = await client.query({
        query: GET_USERS,
        variables: {
          first: 5,
          skip: value,
        },
      });

      const users = response && response.data && response.data.users;
      updateUsersState(users);
      // do something to fetch more
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
      await Promise.all(
        users.map(async user => {
          const wei = await library.eth.getBalance(user.id);
          const userEthBalance = library.utils.fromWei(wei);
          user.ethBalance = userEthBalance;
        }),
      );

      const { data } = await client.query({
        query: GET_ALL_USERS_STATE,
      });

      debugger;

      const usersState = data && data.getAllUsers && data.getAllUsers.users;

      let updatedUsers = [];

      if (usersState && usersState.length) {
        updatedUsers = [...usersState, ...users];
      } else {
        updatedUsers = users;
      }
      debugger;

      await client.mutate({
        mutation: UPDATE_USERS_STATE,
        variables: {
          users: updatedUsers,
        },
      });

      setUsers(updatedUsers);
      setFetching(false);
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
        <Paper>
          <Toolbar>Users Lists</Toolbar>
          <InfiniteScroll
            pageStart={0}
            loadMore={value => fetchMoreUsers(value)}
            hasMore={true}
            loader={
              <Grid className="py-3 text-center" item xs={12}>
                <CircularProgress />
              </Grid>
            }
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Wallet Address</TableCell>
                  <TableCell>Eth Balance</TableCell>
                  <TableCell>Transaction No.</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users &&
                  users.map(user => {
                    return (
                      <TableRow key={user.id}>
                        {user && user.id && (
                          <TableCell component="th" scope="tx">
                            {user.id}
                          </TableCell>
                        )}
                        {user && user.ethBalance && (
                          <TableCell component="th" scope="tx">
                            {user.ethBalance}
                          </TableCell>
                        )}
                        {user && user.txs && (
                          <TableCell component="th" scope="tx">
                            {user.txs.length}
                          </TableCell>
                        )}
                        {user && user.id && (
                          <TableCell component="th" scope="tx">
                            <Button
                              color="primary"
                              variant="contained"
                              size="small"
                              onClick={() =>
                                history.push(`${routeTemplates.user.root}/${user.id}`, { user })
                              }
                            >
                              View More
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withRouter(withApollo(withSnackbar(UsersLists)));
