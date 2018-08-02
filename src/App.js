import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';

import firebase from './firebase';
import { loginSuccess } from './actions/auth';
import { RootNavigator, UnauthenticatedNavigator } from './router';

const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

class App extends Component {
  state = { loaded: false };

  async componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ loaded: true });

      if (user) {
        this.props.loginSuccess(user);
      }
    });
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
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
  { loginSuccess }
)(App);
