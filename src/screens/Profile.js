import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, StyleSheet, Text, View } from 'react-native';

import { logOut } from '../actions/auth';

class Profile extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Button onPress={this.props.logOut} title="Log Out" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default connect(
  ({ auth }) => ({
    auth,
  }),
  { logOut }
)(Profile);
