import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { useForm, useField } from 'react-final-form-hooks';
import { useWeb3Context } from 'web3-react';
import { withSnackbar } from 'notistack';
import {
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Paper,
} from '@material-ui/core';
import { ArrowDownward } from '@material-ui/icons';
import keygen from 'keygenerator';
import { UPDATE_USERS_STATE } from './gql';

const fieldNames = {
  sender: 'sender',
  receiver: 'receiver',
};

const Form = props => {
  const web3Context = useWeb3Context();
  const { library } = web3Context;
  const {
    options,
    currentUser,
    users,
    client,
    setIsOpen,
    handleSendingTransaction,
    enqueueSnackbar,
  } = props;
  const [formState, setFormState] = useState({
    [fieldNames.sender]: currentUser.ethBalance,
    [fieldNames.receiver]: '',
  });

  const updateUserTransaction = async (walletAddress, tokenAmount) => {
    let wei = library.utils.toWei(tokenAmount);
    console.log('wei', wei);
    try {
      return {
        id: keygen._(),
        timeStamp: Date.now() / 1000,
        exchangeAddress: walletAddress,
        tokenSymbol: 'ETH',
        tokenAmount: wei,
        fee: library.utils.toWei('0.1'),
        block: 7129320 + 1 + users.length,
      };
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

  const onSubmit = async values => {
    const { sender, receiver } = values;
    const senderTokenValue = sender;
    const receiverTokenValue = receiver;
    const receiverUser = users.find(user => user.ethBalance === receiverTokenValue);

    receiverUser.ethBalance = receiverUser.ethBalance + senderTokenValue;
    currentUser.ethBalance = currentUser.ethBalance - senderTokenValue;

    handleSendingTransaction(true);

    try {
      const receiverUserTxs = await updateUserTransaction(receiverUser.id, sender);
      const currentUserTxs = await updateUserTransaction(receiverUser.id, sender);

      if (receiverUserTxs && currentUserTxs) {
        receiverUser.txs = [receiverUserTxs, ...receiverUser.txs];
        currentUser.txs = [currentUserTxs, ...currentUser.txs];

        const updatedUsersArray = [...users, receiverUser, currentUser];

        await client.mutate({
          mutation: UPDATE_USERS_STATE,
          variables: {
            users: updatedUsersArray,
          },
        });
        // fake response timeout
        await new Promise(resolve => setTimeout(resolve, 5000));
        handleSendingTransaction(false);
        setIsOpen(false);

        enqueueSnackbar('Token send succesfully', {
          variant: 'success',
          action: (
            <Button color="default" variant="flat" size="small">
              Close
            </Button>
          ),
        });
      }
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

  const validate = values => {
    const errors = {};
    if (!values[fieldNames.sender]) {
      errors[fieldNames.sender] = 'Required';
    }
    if (!values[fieldNames.receiver]) {
      errors[fieldNames.receiver] = 'Required';
    }
    if (values[fieldNames.sender] > currentUser.ethBalance) {
      debugger;
      errors[fieldNames.sender] = 'Exceeded Token Balance!';
    }
    return errors;
  };

  const { form, handleSubmit, submitting } = useForm({
    onSubmit,
    validate,
  });
  const sender = useField('sender', form);
  const receiver = useField('receiver', form);

  const handleChange = field => event => {
    const { input } = field;
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
    input.onChange(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation className="p-3">
        <TextField
          id={fieldNames.sender}
          name={fieldNames.sender}
          fullWidth
          error={!!sender.meta.touched && !!sender.meta.error}
          label={
            !!sender.meta.touched && !!sender.meta.error ? sender.meta.error : 'Token Amount (Eth)'
          }
          value={formState[fieldNames.sender]}
          defaultValue={currentUser.ethBalance}
          onChange={handleChange(sender)}
          type="number"
        />
        <FormHelperText>User Token - {currentUser.ethBalance}</FormHelperText>
      </Paper>

      <div className="text-center pt-3">
        <ArrowDownward />
      </div>

      <Paper elevation className="p-3">
        <FormControl fullWidth>
          <InputLabel htmlFor="age-simple">Exchange Address</InputLabel>
          <Select
            id={fieldNames.receiver}
            name={fieldNames.receiver}
            value={formState[fieldNames.receiver]}
            onChange={handleChange(receiver)}
          >
            {options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {receiver.meta.touched && receiver.meta.error && (
            <FormHelperText>{receiver.meta.error}</FormHelperText>
          )}
        </FormControl>
      </Paper>

      <DialogActions>
        <Button variant="outlined" type="submit" disabled={submitting}>
          Transfer
        </Button>
      </DialogActions>
    </form>
  );
};

Form.propTypes = {
  options: PropTypes.array,
  currentUserEthBalance: PropTypes.isRequired,
  currentUser: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  handleSendingTransaction: PropTypes.func.isRequired,
};

export default withApollo(withSnackbar(Form));
