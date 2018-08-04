import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { addFriend, removeFriend } from '../actions/friends';
import { db } from '../firebase';
import Activity from '../components/Activity';
import ModalHeader from '../components/ModalHeader';

class UserProfile extends Component {
  static propTypes = {
    addFriend: PropTypes.func.isRequired,
    removeFriend: PropTypes.func.isRequired,
  };

  state = {
    selectedButton: 0,
    loading: true,
    user: null,
    userId: null,
  };

  // TOOD(dcramer): turn this into AsyncComponent
  async componentWillMount() {
    let user = this.props.navigation.getParam('user');
    let userId = this.props.navigation.getParam('userId');
    if (user) {
      this.setState({
        loading: false,
        user,
        userId,
      });
    } else {
      this.fetchUser(this.props.navigation.getParam('userId'));
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.getParam('userId') !== this.state.userId) {
      this.fetchUser(nextProps.navigation.getParam('userId'));
    }
  }

  async fetchUser(userId) {
    db.collection('users')
      .child(userId)
      .get()
      .then(doc => {
        this.setState({
          loading: false,
          userId,
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

  toggleFriend() {
    if (this.state.isFriend) {
      this.removeFriend(this.props.auth.user.uid, this.state.userId);
    } else {
      this.addFriend(this.props.auth.user.uid, this.state.userId);
    }
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
        <TouchableOpacity onPress={this.toggleFriend}>
          <View style={styles.friendAction}>
            <Icon name="user-plus" size={18} />
            <Text>Add to Friends</Text>
          </View>
        </TouchableOpacity>
        <Activity
          queryset={db
            .collection('checkins')
            .where('user', '==', this.state.user.id)
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
  { addFriend, removeFriend }
)(UserProfile);
