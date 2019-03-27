import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { GET_ALL_USERS_STATE } from './gql';
import Form from './form';

const UserTokenTransferButton = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [usersState, setUsersState] = useState([]);
  const [options, setOptions] = useState([]);
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const { children, currentUser, client } = props;

  console.log('sendingTransaction', sendingTransaction);

  useEffect(() => {
    getAllUsersFromState();
  }, []);

  useEffect(() => {
    filterOptions();
  }, [usersState]);

  const getAllUsersFromState = async () => {
    try {
      const { data } = await client.query({
        query: GET_ALL_USERS_STATE,
      });
      const users = data && data.store && data.store.users;

      setUsersState(users);
    } catch (error) {
      console.log(error.message);
    }
  };

  const filterOptions = () => {
    const usersOptions =
      usersState &&
      usersState
        .filter(elem => elem.id !== currentUser.id)
        .map(elem => {
          return {
            label: elem.id,
            value: elem.ethBalance,
          };
        });
    setOptions(usersOptions);
  };

  const renderSendinTransaction = () => {
    return (
      <div className="text-center p-5">
        <div className="pb-3">
          <h2>Sending Transaction</h2>
        </div>
        <CircularProgress />
      </div>
    );
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="token-transfer-modal"
      >
        <DialogTitle id="token-transfer-modal">
          <DialogActions>
            <IconButton aria-label="Close" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogActions>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {sendingTransaction ? (
              <Fragment>{renderSendinTransaction()}</Fragment>
            ) : (
              <Form
                client={client}
                options={options}
                currentUserEthBalance={currentUser.ethBalance}
                currentUser={currentUser}
                users={usersState}
                setIsOpen={setIsOpen}
                handleSendingTransaction={bool => setSendingTransaction(bool)}
              />
            )}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Fragment>
      <Button onClick={() => setIsOpen(true)} variant="contained" color="primary">
        {children}
      </Button>
      {renderDialog()}
    </Fragment>
  );
};

UserTokenTransferButton.propTypes = {
  id: PropTypes.string.isRequired,
  currentUser: PropTypes.object.isRequired,
};

export default withApollo(UserTokenTransferButton);
