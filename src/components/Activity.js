import React, { Component } from 'react';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { db } from '../firebase';
import { colors, layout } from '../styles';
import CheckIn from '../components/CheckIn';
import LoadingIndicator from '../components/LoadingIndicator';

import { populateRelations } from '../utils/query';

export default class Activity extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, error: null, items: [] };
  }

  async componentDidMount() {
    this.unsubscribeCheckins = this.props.queryset.limit(25).onSnapshot(
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
        console.error(error);
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
    backgroundColor: colors.background,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  activityContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: layout.statusBarHeight,
  },
  searchBarContainer: {
    backgroundColor: colors.primary,
    borderTopWidth: 0,
  },
  searchBarInput: {
    color: colors.dark,
    backgroundColor: '#eee',
  },
});
