import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useForm, useField } from 'react-final-form-hooks';

const Form = props => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    // onSubmit,
    // validate,
  });

  const senderField = useField('sender', form);
  const receiverField = useField('receiver', form);

  const onTransferToken = values => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onTransferToken)}>
      <div>
        <label>First Name</label>
        <input {...senderField.input} placeholder="First Name" />
        {senderField.meta.touched && senderField.meta.error && (
          <span>{senderField.meta.error}</span>
        )}
      </div>
      <div>
        <label>Last Name</label>
        <input {...receiverField.input} placeholder="Last Name" />
        {receiverField.meta.touched && receiverField.meta.error && (
          <span>{receiverField.meta.error}</span>
        )}
      </div>
      <div className="buttons">
        <button type="submit" disabled={submitting}>
          Submit
        </button>
        <button type="button" onClick={() => form.reset()} disabled={submitting || pristine}>
          Reset
        </button>
      </div>
      <pre>{JSON.stringify(values, undefined, 2)}</pre>
    </form>
  );
};

const UserTokenTransferButton = props => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const { children, user, users } = props;

  useEffect(() => {
    if (user && users) {
      filterOptions();
    }
  });

  const filterOptions = () => {
    const usersOptions = users
      .filter(elem => elem.id !== user.id)
      .map(elem => {
        console.log(elem);

        return {
          label: elem.id,
          value: elem.ethBalance,
        };
      });
    console.log('usersOptions', usersOptions);
  };

  const renderDialog = () => {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        aria-labelledby="token-transfer-modal"
      >
        <DialogTitle id="token-transfer-modal">
          <IconButton className="" aria-label="Close" onClick={() => setIsOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Form />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
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
