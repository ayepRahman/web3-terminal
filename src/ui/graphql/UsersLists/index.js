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
      let users = response && response.data && response.data.users;

      await Promise.all(
        users.map(async user => {
          const wei = await library.eth.getBalance(user.id);
          const userEthBalance = library.utils.fromWei(wei);
          user.ethBalance = userEthBalance;
        }),
      );

      console.log(users);
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

  const updateUsersState = async users => {
    console.log('TRIGGER');
    try {
      debugger;
      const { data } = await client.query({
        query: GET_ALL_USERS_STATE,
      });

      const usersState = data && data.users;

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
          updatedUsers,
        },
      });

      debugger;

      setUsers(updatedUsers);
      setFetching(false);

      debugger;
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

  const fetchMore = async () => {
    try {
      // const response = await client.mutate({})
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

  if (fetching) return <LinearProgress />;

  return (
    <Grid className="py-5" container justify="center">
      <Grid item xs={10} md={8}>
        <h1>Users Lists</h1>
      </Grid>

      <Grid item xs={10} md={8}>
        <Paper>
          <Toolbar>Users</Toolbar>
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
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={() => fetchMore()}
                      hasMore={true}
                      loader={
                        <Grid className="pt-5 text-center" item xs={12}>
                          <CircularProgress />
                        </Grid>
                      }
                    >
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
                    </InfiniteScroll>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withRouter(withApollo(withSnackbar(UsersLists)));
