import React from 'react';
import { withApollo, Query } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
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
} from '@material-ui/core';
import moment from 'moment';
import { utils } from 'ethers';
import UserTokenTransferButton from 'ui/graphql/mutations/UserTokenTransferButton';
import LinearProgress from '@material-ui/core/LinearProgress';

export const GET_SINGLE_USER_BY_ID_STATE = gql`
  query getUserById($id: ID!) {
    getUserById(id: $id) @client
  }
`;

const UserDetails = props => {
  const { match } = props;
  const userId = match && match.params && match.params.id;

  return (
    <Query query={GET_SINGLE_USER_BY_ID_STATE} variables={{ id: userId }}>
      {({ loading, data }) => {
        const user = data && data.getUserById && data.getUserById.user;

        if (loading) return <LinearProgress />;

        return (
          <Grid className="py-5" container justify="center">
            <Grid className="pb-3" item xs={5}>
              <Paper className="p-3">
                <h2 className="text-center ">User Details</h2>
                {user && user.id && (
                  <p>
                    <b>Wallet Address</b> - {user.id}
                  </p>
                )}

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
                  {user && (
                    <div className="ml-auto">
                      <UserTokenTransferButton currentUser={user}>
                        Send Transaction
                      </UserTokenTransferButton>
                    </div>
                  )}
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
                      user.txs &&
                      user.txs.map(tx => (
                        <TableRow key={tx.id}>
                          {tx && tx.timeStamp && (
                            <TableCell component="th" scope="tx">
                              {moment(tx.timeStamp * 1000).format('lll')}
                            </TableCell>
                          )}
                          {tx && tx.exchangeAddress && <TableCell>{tx.exchangeAddress}</TableCell>}
                          {tx && tx.tokenSymbol && <TableCell>{tx.tokenSymbol}</TableCell>}
                          {tx && tx.tokenAmount && (
                            <TableCell>{utils.formatEther(tx.tokenAmount)}</TableCell>
                          )}
                          {tx && tx.fee && (
                            <TableCell>{tx.fee && utils.formatEther(tx.fee)}</TableCell>
                          )}
                          {tx && tx.block && <TableCell>{tx.block}</TableCell>}
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
