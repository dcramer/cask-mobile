import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { withNavigation } from 'react-navigation';

import { db } from '../firebase';
import { buildSuccessorKey } from '../utils/query';
import Friend from '../components/Friend';
import SearchBar from '../components/SearchBar';

class FindFriends extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
    };
  }
  _renderItem = ({ item }) => <Friend user={item} />;

  _keyExtractor = item => item.id;

  onPressPerson = value => {};

  onSearch = searchQuery => {
    this.setState({ searchQuery, searchLoading: true });
    db.collection('users')
      .where('displayName', '>=', searchQuery)
      .where('displayName', '<', buildSuccessorKey(searchQuery))
      .orderBy('displayName')
      .limit(25)
      .get()
      .then(snapshot => {
        let items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.setState({
          searchLoading: false,
          searchResults: items,
        });
      })
      .catch(error => {
        this.setState({ searchError: error, searchLoading: false });
        Sentry.captureException(error);
      });
  };

  render() {
    let { searchResults, searchQuery } = this.state;
    return (
      <View style={styles.container}>
        <SearchBar onChangeValue={this.onSearch} loading={this.state.searchLoading} />
        {searchQuery && searchResults.length === 0 ? (
          <Text>No results found.</Text>
        ) : (
          <FlatList
            data={this.state.searchResults}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withNavigation(FindFriends);
