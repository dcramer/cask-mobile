import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';

import { RootNavigator, UnauthenticatedNavigator } from './router';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends Component {
  async componentDidMount() {
    StatusBar.setHidden(true);
  }

  render() {
    if (!this.props.auth.user) {
      return <UnauthenticatedNavigator {...this.props} />;
    }
    return <RootNavigator persistenceKey={navigationPersistenceKey} {...this.props} />;
  }
}

export default connect(({ auth }) => ({
  auth,
}))(App);
