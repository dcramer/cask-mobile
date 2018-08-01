import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AccessToken } from 'react-native-fbsdk';

import { logInSuccess } from './actions/auth';
import { RootNavigator, UnauthenticatedNavigator } from './router';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends Component {
  async componentDidMount() {
    AccessToken.getCurrentAccessToken().then(data => {
      this.props.logInSuccess(data);
    });
  }

  render() {
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
  { logInSuccess }
)(App);
