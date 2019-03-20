import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import routeTemplates from 'ui/routes/templates';

import Home from 'ui/routes/Home';
import UserDetails from 'ui/routes/User';

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={routeTemplates.home} component={Home} />
        <Route exact path={routeTemplates.user.details} component={UserDetails} />
      </Switch>
    </Router>
  );
};

export default App;
