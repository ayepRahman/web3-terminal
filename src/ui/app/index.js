import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routeTemplates from 'ui/routes/templates';

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={routeTemplates.home} component={HomePage} />
        <Route exact path={routeTemplates.auth.signUp} component={SignUpPage} />
        <Route exact path={routeTemplates.auth.login} component={LoginPage} />
      </Switch>
    </Router>
  );
};
