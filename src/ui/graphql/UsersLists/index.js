import React, { useEffect, useState } from 'react';
import { withApollo } from 'react-apollo';
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

const UsersLists = props => {
  const web3Context = useWeb3Context();
  const { setConnector, library } = web3Context;
  const { enqueueSnackbar, history, client } = props;
  const [fetching, setFetching] = useState(true);
  const [users, setUsers] = useState(false);

  useEffect(() => {
    const web3Library = web3Context.connectorName === 'infura' && web3Context.library;

    if (!web3Library) {
      setConnector('infura');
    }
  }, []);

  useEffect(() => {
    if (library) {
      fetchUsers();
    }
  }, [library]);

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

  const fetchMoreUsers = async skip => {
    try {
      const response = await client.query({
        query: GET_USERS,
        variables: {
          first: 5,
          skip,
        },
      });

      const users = response && response.data && response.data.users;
      updateUsersState(users);
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

      const usersState = data && data.store && data.store.users;

      let updatedUsers = [];

      if (usersState && usersState.length) {
        updatedUsers = [...usersState, ...users];
      } else {
        updatedUsers = users;
      }

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
            loadMore={page => fetchMoreUsers(page)}
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
                  users.map((user, index) => {
                    return (
                      <TableRow key={index}>
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
