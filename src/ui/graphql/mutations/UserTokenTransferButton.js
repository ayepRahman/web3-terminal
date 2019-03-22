import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { useForm, useField } from 'react-final-form-hooks';
import {
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  TextField,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const GET_ALL_USERS_STATE = gql`
  query getAllUsers {
    getAllUsers @client
  }
`;

const UPDATE_USERS_STATE = gql`
  mutation updateUsers($users: [User]) {
    updateUsers(users: $users) @client
  }
`;

const fieldNames = {
  sender: 'sender',
  receiver: 'receiver',
};

const Form = props => {
  const { options, currentUserEthBalance, currentUser, users, client } = props;
  const [formState, setFormState] = useState({
    [fieldNames.sender]: currentUserEthBalance,
    [fieldNames.receiver]: '',
  });

  const onSubmit = async values => {
    const { sender, receiver } = values;
    const senderTokenValue = sender;
    const receiverTokenValue = receiver;
    const receiverUser = users.find(user => user.ethBalance === receiverTokenValue);

    receiverUser.ethBalance = receiverUser.ethBalance + senderTokenValue;
    currentUser.ethBalance = currentUserEthBalance - senderTokenValue;

    const updatedUsersArray = [...users, receiverUser, currentUser];

    debugger;

    try {
      await client.mutate({
        mutation: UPDATE_USERS_STATE,
        variables: {
          users: updatedUsersArray,
        },
      });
    } catch (error) {
      console.log(error.message);
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
    if (values[fieldNames.sender] > currentUserEthBalance) {
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
      <div>
        <TextField
          id={fieldNames.sender}
          name={fieldNames.sender}
          fullWidth
          error={!!sender.meta.touched && !!sender.meta.error}
          label={!!sender.meta.touched && !!sender.meta.error ? sender.meta.error : 'Token Amount'}
          value={formState[fieldNames.sender]}
          defaultValue={currentUserEthBalance}
          onChange={handleChange(sender)}
          type="number"
        />
        <FormHelperText>User Token - {currentUserEthBalance}</FormHelperText>
      </div>

      <div className="text-center pt-3">
        <h1>To</h1>
      </div>

      <div className="py-3">
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
      </div>

      <DialogActions>
        <Button variant="outlined" type="submit" disabled={submitting}>
          Transfer
        </Button>
      </DialogActions>
    </form>
  );
};

const UserTokenTransferButton = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [usersState, setUsersState] = useState([]);
  const [options, setOptions] = useState([]);
  const { children, currentUser, client } = props;

  useEffect(() => {
    getAllUsersFromState();
    console.log('getAllUsersFromState');
  }, []);

  useEffect(() => {
    filterOptions();
    console.log('filterOptions');
  }, [usersState]);

  const getAllUsersFromState = async () => {
    try {
      const { data } = await client.query({
        query: GET_ALL_USERS_STATE,
      });

      const users = data && data.getAllUsers && data.getAllUsers.users;

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
          console.log(elem);

          return {
            label: elem.id,
            value: elem.ethBalance,
          };
        });
    setOptions(usersOptions);
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
            <Form
              client={client}
              options={options}
              currentUserEthBalance={currentUser.ethBalance}
              currentUser={currentUser}
              users={usersState}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Fragment>
      <Button onClick={() => setIsOpen(true)} variant="outlined" color="inherit">
        {children}
      </Button>
      {renderDialog()}
    </Fragment>
  );
};

UserTokenTransferButton.propTypes = {
  id: PropTypes.string.isRequired,
};

export default withApollo(UserTokenTransferButton);
