import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { getAllFromCollection } from '../utils/query';
import { db } from '../firebase';
import LoadingIndicator from '../components/LoadingIndicator';
import Friend from '../components/Friend';

export default class FriendList extends Component {
  static propTypes = {
    userId: PropTypes.string.isRequired,
  };

  state = { loading: true, error: null, items: [] };

  async componentDidMount() {
    this.unsubscribeFriends = db
      .collection('users')
      .doc(this.props.userId)
      .collection('friends')
      .orderBy('createdAt', 'desc')
      .limit(25)
      .onSnapshot(
        snapshot => {
          getAllFromCollection('users', snapshot.docs.map(doc => doc.id))
            .then(snapshot => {
              this.setState({
                loading: false,
                error: null,
                items: snapshot.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                })),
              });
            })
            .catch(error => {
              this.setState({ error, loading: false });
              Sentry.captureException(error);
            });
        },
        error => {
          this.setState({ error, loading: false });
          Sentry.captureException(error);
        }
      );
  }

  async componentWillUnmount() {
    this.unsubscribeFriends && this.unsubscribeFriends();
  }

  _renderItem = ({ item }) => {
    return <Friend user={item} />;
  };

  _keyExtractor = item => item.id;

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    if (this.state.error) {
      return (
        <View style={styles.activityContainer}>
          <Text>Error: {this.state.error.message}</Text>
        </View>
      );
    }
    return (
      <View style={styles.activityContainer}>
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
