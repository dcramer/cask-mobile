import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchAccessToken } from './actions/auth';
import { RootNavigator, UnauthenticatedNavigator } from './router';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends Component {
  constructor(...args) {
    super(...args);
    this.props.fetchAccessToken();
  }

  render() {
    if (this.props.auth.validToken === null) {
      return null;
    }
    if (!this.props.auth.user) {
      return <UnauthenticatedNavigator {...this.props} />;
    }
    return <RootNavigator persistenceKey={navigationPersistenceKey} {...this.props} />;
  }
}

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { fetchAccessToken }
)(App);
