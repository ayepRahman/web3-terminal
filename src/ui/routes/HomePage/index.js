import React from 'react';
import { Grid, Button } from '@material-ui/core';

import { withRouter } from 'react-router-dom';
import routeTemplates from 'ui/routes/templates';
import ethLogo from 'resources/img/ethLogo.png';

const Home = props => {
  const { history } = props;

  return (
    <Grid className="pt-5" alignItems="center" container justify="center">
      <Grid className="test-center" item xs={3}>
        <h1>Web3 Terminal</h1>
        <p>
          A simple project that uses the new React Hooks, Apollo Client and Uniswap api which is a
          decentralized protocol for automated token exchange on Ethereum. A simple interface for
          making fake transaction using uniswap api.
        </p>
        <div className="pt-3">
          <Button
            onClick={() => history.push(routeTemplates.user.root)}
            color="primary"
            variant="outlined"
          >
            Access
          </Button>
        </div>
      </Grid>
      <Grid className="text-center" item xs={3}>
        <img height="400" width="400" src={ethLogo} alt="ethLogo" />
      </Grid>
    </Grid>
  );
};

Home.propTypes = {};

export default withRouter(Home);
