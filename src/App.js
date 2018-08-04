import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import firebase from './firebase';
import { loginSuccess } from './actions/auth';
import { RootNavigator, UnauthenticatedNavigator } from './router';
import Loading from './screens/Loading';

// const navigationPersistenceKey = __DEV__ ? 'NavigationStateDEV' : null;

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
    return <View style={styles.container}>{this.renderBody()}</View>;
  }

  renderBody() {
    if (!this.state.loaded) {
      return <Loading />;
    }
    if (!this.props.auth.user) {
      return <UnauthenticatedNavigator {...this.props} />;
    }
    return <RootNavigator {...this.props} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { loginSuccess }
)(App);
