import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routeTemplates from 'ui/routes/templates';
import { useWeb3Context } from 'web3-react';

import HomePage from 'ui/routes//HomePage';
import UsersPage from 'ui/routes/UsersPage';
import UserDetailsPage from 'ui/routes/UserDetailsPage';

export const App = () => {
  const web3Context = useWeb3Context();
  const { setConnector } = web3Context;

  useEffect(() => {
    const web3Library = web3Context.connectorName === 'infura' && web3Context.library;

    if (!web3Library) {
      setConnector('infura');
    }
  }, []);

  return (
    <Router>
      <Route exact path={routeTemplates.home} component={HomePage} />
      <Switch>
        <Route exact path={routeTemplates.user.root} component={UsersPage} />
        <Route path={routeTemplates.user.details} component={UserDetailsPage} />
      </Switch>
    </Router>
  );
};

export default App;
