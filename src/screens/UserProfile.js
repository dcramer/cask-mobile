import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';

import { db } from '../firebase';
import Activity from '../components/Activity';
import ModalHeader from '../components/ModalHeader';
import FriendAction from '../components/FriendAction';

class UserProfile extends Component {
  state = {
    selectedButton: 0,
    loading: true,
    user: null,
    userId: null,
  };

  // TOOD(dcramer): turn this into AsyncComponent
  async componentWillMount() {
    let user = this.props.navigation.getParam('user');
    let userId = this.props.navigation.getParam('id');
    if (user) {
      this.setState({
        loading: false,
        user,
        userId: userId || user.id,
      });
    } else {
      this.fetchUser(this.props.navigation.getParam('id'));
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.getParam('id') !== this.state.userId) {
      this.fetchUser(nextProps.navigation.getParam('id'));
    }
  }

  async fetchUser(userId) {
    db.collection('users')
      .doc(userId)
      .get()
      .then(doc => {
        this.setState({
          loading: false,
          userId: doc.id,
          user: {
            id: doc.id,
            ...doc.data(),
          },
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error,
        });
      });
  }

  render() {
    if (this.state.loading) return null;
    return (
      <View style={styles.container}>
        <ModalHeader
          title={this.state.user.displayName}
          leftActionOnPress={null}
          rightActionOnPress={null}
        />
        <FriendAction userId={this.state.userId} />
        <Activity
          queryset={db
            .collection('checkins')
            .where('userAdded', '==', this.state.userId)
            .orderBy('createdAt', 'desc')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  friendAction: {},
});

export default connect(
  () => ({}),
  {}
)(UserProfile);
