import React, { useState, Fragment } from 'react';
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

const UserTokenTransferButton = props => {
  const [isOpen, setIsOpen] = useState(false);

  const { children } = props;

  const handleClose = () => {
    console.log('TRIGGER');
    setIsOpen(false);
  };

  // const renderForm = () => {};

  const renderDialog = () => {
    return (
      <Dialog
        fullWidth
        maxWidth="lg"
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="max-width-dialog-title"
      >
        <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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
