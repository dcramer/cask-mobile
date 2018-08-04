import React, { Component } from 'react';
import { Sentry } from 'react-native-sentry';
import { FlatList, Text } from 'react-native';

import CheckIn from '../components/CheckIn';
import LoadingIndicator from '../components/LoadingIndicator';

import { populateRelations } from '../utils/query';

export default class Activity extends Component {
  state = { loading: true, error: null, items: [] };

  async componentDidMount() {
    this.unsubscribeFriends = this.props.queryset.limit(25).onSnapshot(
      snapshot => {
        let checkins = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        populateRelations(checkins, [
          {
            name: 'bottle',
            collection: 'bottles',
            relations: [{ name: 'distillery', collection: 'distilleries' }],
          },
          {
            name: 'user',
            collection: 'users',
          },
          {
            name: 'location',
            collection: 'locations',
          },
        ])
          .then(items => {
            this.setState({
              loading: false,
              error: null,
              items,
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
    this.unsubscribeCheckins && this.unsubscribeCheckins();
  }

  _renderItem = ({ item }) => <CheckIn checkIn={item} />;

  _keyExtractor = item => item.id;

  render() {
    if (this.state.loading) {
      return <LoadingIndicator />;
    }
    if (this.state.error) {
      return <Text>Error: {this.state.error.message}</Text>;
    }
    return (
      <FlatList
        data={this.state.items}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}
