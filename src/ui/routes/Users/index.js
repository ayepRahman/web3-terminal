import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import UsersLists from 'ui/graphql/UsersLists';

const Users = props => {
  return (
    <div>
      <UsersLists />
    </div>
  );
};

export default Users;
