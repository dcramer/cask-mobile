import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';

import { db } from '../firebase';
import { colors, layout, margins } from '../styles';
import Activity from '../components/Activity';
import AlertCard from '../components/AlertCard';
import Bottle from '../components/Bottle';
import LoadingIndicator from '../components/LoadingIndicator';
import SearchBar from '../components/SearchBar';

import { buildSuccessorKey, populateRelations } from '../utils/query';

class SearchResults extends Component {
  _renderItem = ({ item }) => <Bottle bottle={item} />;

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.searchContainer}>{this.renderChild()}</View>;
  }

  renderChild() {
    let { query, error, loading, results } = this.props;
    if (error) {
      return <Text>{error.message}</Text>;
    }

    if (query && !loading && !results.length) {
      return (
        <AlertCard
          onPress={() => {
            this.props.navigation.navigate('AddBottle');
          }}
          heading="Can't find a bottle?"
          subheading={`Tap here to add ${query}.`}
        />
      );
    }

    if (loading && !results.length) {
      return <LoadingIndicator />;
    }

    if (query) {
      return (
        <View>
          <FlatList
            data={results}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
          <AlertCard
            onPress={() => {
              this.props.navigation.navigate('AddBottle');
            }}
            heading="Can't find a bottle?"
            subheading={`Tap here to add ${this.props.query}.`}
          />
        </View>
      );
    }

    return <Text>Type something!</Text>;
  }
}

class Home extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(...args) {
    super(...args);
    this.state = {
      searchActive: false,
      searchQuery: null,
      searchResults: [],
      searchLoading: false,
    };
  }

  onSearch = query => {
    this.setState({ searchQuery: query, searchLoading: true });
    db.collection('bottles')
      .where('name', '>=', query)
      .where('name', '<', buildSuccessorKey(query))
      .orderBy('name')
      .limit(25)
      .get()
      .then(snapshot => {
        let items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        populateRelations(items, [
          {
            name: 'distillery',
            collection: 'distilleries',
          },
        ]).then(items => {
          this.setState({
            searchLoading: false,
            searchResults: items,
          });
        });
      })
      .catch(error => {
        this.setState({ searchError: error, searchLoading: false });
        Sentry.captureException(error);
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            onFocus={() => this.setState({ searchActive: true })}
            onBlur={() => this.setState({ searchActive: false })}
            onChangeValue={this.onSearch}
            style={styles.searchBarContainer}
            loading={this.state.searchLoading}
          />
        </View>
        <View style={styles.resultsContainer}>
          {this.state.searchActive || !!this.state.searchQuery ? (
            <SearchResults
              query={this.state.searchQuery}
              loading={this.state.searchLoading}
              error={this.state.searchError}
              navigation={this.props.navigation}
              results={this.state.searchResults}
            />
          ) : (
            <Activity
              auth={this.props.auth}
              navigation={this.props.navigation}
              queryset={db
                .collection('checkins')
                // .where('user', '==', this.props.auth.user.uid)
                .orderBy('createdAt', 'desc')}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    paddingTop: margins.half,
  },
  searchContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: layout.statusBarHeight,
  },
});

export default connect(({ auth }) => ({ auth }))(Home);
