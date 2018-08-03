import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { SearchBar } from 'react-native-elements';

import { db } from '../firebase';
import { layout } from '../styles';
import Bottle from '../components/Bottle';
import CheckIn from '../components/CheckIn';
import LoadingIndicator from '../components/LoadingIndicator';

const getAll = docs => {
  return Promise.all(
    docs.map(
      doc =>
        new Promise((resolve, reject) => {
          doc
            .get()
            .then(resolve)
            .catch(reject);
        })
    )
  );
};

const populateRelations = (items, relations) => {
  /*
  * Populates relations on a set of items (effectively a hash join).
  *
  *   populateRelations(snapshot.docs, [
  *     {name: 'bottle', collection: 'bottles'}
  *   ])
  */
  return Promise.all(
    relations.map(({ name, collection }) =>
      getAll(items.filter(d => !!d[name]).map(d => db.doc(`${collection}/${d[name]}`))).then(
        snapshot => {
          let results = {};
          snapshot.forEach(doc => {
            results[doc.id] = {
              id: doc.id,
              ...doc.data(),
            };
          });
          return { name, results };
        }
      )
    )
  ).then(values => {
    return new Promise(resolve => {
      resolve(
        items.map(item => {
          let result = { ...item };
          values.forEach(({ name, results }) => {
            result[name] = results[item[name]];
          });
          return result;
        })
      );
    });
  });
};

class RecentActivity extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true, error: null, items: [] };
  }

  async componentDidMount() {
    this.unsubscribeCheckins = db
      .collection('checkins')
      .where('user', '==', this.props.auth.user.uid)
      .limit(25)
      .onSnapshot(
        checkinsSnapshot => {
          let checkins = checkinsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          populateRelations(checkins, [
            {
              name: 'bottle',
              collection: 'bottles',
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
                items: items,
              });
            })
            .catch(error => {
              this.setState({ error, loading: false });
              Sentry.captureException(error);
            });
        },
        error => {
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

class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: null, items: [] };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  fetchData = () => {
    let { query } = this.props;
    if (!query) return;
    this.setState({ loading: true });
    db.collection('bottles')
      .where('name', '>=', this.props.query)
      .orderBy('name')
      .limit(25)
      .get()
      .then(snapshot => {
        this.setState({
          loading: false,
          items: snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
        Sentry.captureException(error);
      });
  };

  _renderItem = ({ item }) => <Bottle bottle={item} />;

  _keyExtractor = item => item.id;

  render() {
    return <View style={styles.searchContainer}>{this.renderChild()}</View>;
  }

  renderChild() {
    if (this.state.error) {
      return <Text>{this.state.error.message}</Text>;
    }

    if (this.props.query && !this.state.loading && !this.state.items.length) {
      return <Text>Cant find a bottle? [... call to action ...]</Text>;
    }

    if (this.state.loading && !this.state.items.length) {
      return <LoadingIndicator />;
    }

    if (this.props.query) {
      return (
        <FlatList
          data={this.state.items}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
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
    this.state = { searchActive: false, searchQuery: null };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            placeholder="bottle, distillery, style"
            lightTheme
            onFocus={() => this.setState({ searchActive: true })}
            onBlur={() => this.setState({ searchActive: false })}
            onChangeText={text => this.setState({ searchQuery: text })}
            onClearText={text => this.setState({ searchQuery: text })}
            containerStyle={styles.searchBarContainer}
            inputStyle={styles.searchBarInput}
          />
        </View>
        <View style={styles.resultsContainer}>
          {this.state.searchActive || !!this.state.searchQuery ? (
            <SearchResults query={this.state.searchQuery} navigation={this.props.navigation} />
          ) : (
            <RecentActivity auth={this.props.auth} navigation={this.props.navigation} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  activityContainer: {
    flex: 1,
  },
  searchContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight,
  },
  searchBarContainer: {
    backgroundColor: '#7b6be6',
    borderTopWidth: 0,
  },
  searchBarInput: {
    color: '#000',
    backgroundColor: '#eee',
  },
});

export default connect(({ auth }) => ({ auth }))(Home);
