import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
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

const UserDetails = props => {
  const { history } = props;
  const {
    location: { state },
  } = history;
  const { user } = state;

  return (
    <Grid className="py-5" container justify="center">
      <Grid className="text-center pb-3" item xs={4}>
        <Paper className="py-3">
          <h2>User Details</h2>
          <h4>Wallet Address - {user.id}</h4>
          <h4>Eth - {user.ethBalance}</h4>
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
                <TableCell>Event</TableCell>
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
                    <TableCell>{tx.event}</TableCell>
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
};

UserDetails.propTypes = {};

export default withRouter(withApollo(withSnackbar(UserDetails)));
