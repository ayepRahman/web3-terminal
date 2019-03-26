import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routeTemplates from 'ui/routes/templates';

import HomePage from 'ui/routes//HomePage';
import UsersPage from 'ui/routes/UsersPage';
import UserDetailsPage from 'ui/routes/UserDetailsPage';

export const App = () => {
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
