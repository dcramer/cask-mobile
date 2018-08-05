import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { addFriend, removeFriend } from '../actions/friends';
import { db } from '../firebase';

class FriendAction extends Component {
  static propTypes = {
    addFriend: PropTypes.func.isRequired,
    removeFriend: PropTypes.func.isRequired,
  };

  state = {
    loading: true,
    isFriend: null,
  };

  async componentWillMount() {
    await this.fetchStatus();
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.userId !== nextProps.userId) {
      await this.fetchStatus();
    }
  }

  async fetchStatus() {
    let { user } = this.props.auth;
    db.collection('users')
      .doc(user.uid)
      .collection('friends')
      .doc(this.props.userId)
      .get()
      .then(doc => {
        this.setState({
          loading: false,
          isFriend: doc.exists,
        });
      })
      .catch(error => {
        this.setState({
          loading: false,
          error,
        });
      });
  }

  toggleFriend = () => {
    this.setState({ loading: true });
    if (this.state.isFriend) {
      this.props
        .removeFriend(this.props.auth.user.uid, this.props.userId)
        .then(() => {
          this.setState({ isFriend: false, loading: false });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    } else {
      this.props
        .addFriend(this.props.auth.user.uid, this.props.userId)
        .then(() => {
          this.setState({ isFriend: true, loading: false });
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });
    }
  };

  render() {
    let { isFriend, loading } = this.state;
    if (loading) return null;
    return (
      <TouchableOpacity onPress={this.toggleFriend}>
        <View style={styles.friendAction}>
          <Icon name={isFriend ? 'user-minus' : 'user-plus'} size={18} />
          <Text>{isFriend ? 'Remove from friends' : 'Add to Friends'}</Text>
        </View>
      </TouchableOpacity>
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
  ({ auth }) => ({ auth }),
  { addFriend, removeFriend }
)(FriendAction);
