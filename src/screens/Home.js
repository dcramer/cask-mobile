import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sentry } from 'react-native-sentry';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  View,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { db } from '../firebase';
import { layout } from '../styles';
import CustomPropTypes from '../propTypes';
import Bottle from '../components/Bottle';
import CheckIn from '../components/CheckIn';

class BottleEntry extends Component {
  static propTypes = {
    bottle: CustomPropTypes.Bottle.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  _onPress = () => {
    let { bottle, navigation } = this.props;
    navigation.navigate('BottleDetails', { id: bottle.id, bottle });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <Bottle {...this.props} />
      </TouchableOpacity>
    );
  }
}

class CheckInEntry extends Component {
  static propTypes = {
    checkIn: CustomPropTypes.CheckIn.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  _onPress = () => {
    let { checkIn, navigation } = this.props;
    navigation.navigate('CheckInDetails', { id: checkIn.id, checkIn });
  };

  render() {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <CheckIn {...this.props} />
      </TouchableOpacity>
    );
  }
}

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

          let bottlesById = {};
          let usersById = {};
          Promise.all([
            getAll(checkins.map(d => db.doc(`bottles/${d.bottle}`))).then(snapshot => {
              snapshot.forEach(doc => {
                bottlesById[doc.id] = {
                  id: doc.id,
                  ...doc.data(),
                };
              });
            }),
            getAll(checkins.map(d => db.doc(`users/${d.user}`))).then(snapshot => {
              snapshot.forEach(doc => {
                usersById[doc.id] = {
                  id: doc.id,
                  ...doc.data(),
                };
              });
            }),
          ])
            .then(() => {
              this.setState({
                loading: false,
                error: null,
                items: checkins.map(checkin => ({
                  ...checkin,
                  bottle: bottlesById[checkin.bottle],
                  user: usersById[checkin.user],
                })),
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

  _renderItem = ({ item }) => <CheckInEntry checkIn={item} navigation={this.props.navigation} />;

  _keyExtractor = item => item.id;

  render() {
    if (this.state.loading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    if (this.state.error) {
      return (
        <View>
          <Text>Error: {this.state.error.message}</Text>
        </View>
      );
    }
    return (
      <View>
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
    this.state = { loading: true, error: null, items: [] };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.fetchData();
    }
  }

  async fetchData() {
    let { query } = this.props;
    db.collection('bottles')
      // .where('name', '==', this.props.query)
      .startAt(query)
      .endAt(query + '\uf8ff')
      .orderBy('name')
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
  }

  _renderItem = ({ item }) => <BottleEntry bottle={item} navigation={this.props.navigation} />;

  _keyExtractor = item => item.id;

  render() {
    return (
      <View>
        {this.props.query ? (
          <FlatList
            data={this.state.items}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        ) : (
          <Text>Type something!</Text>
        )}
      </View>
    );
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
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
          />
        </View>
        {this.state.searchActive || !!this.state.searchQuery ? (
          <SearchResults query={this.state.searchQuery} navigation={this.props.navigation} />
        ) : (
          <RecentActivity auth={this.props.auth} navigation={this.props.navigation} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    backgroundColor: '#7b6be6',
    paddingTop: layout.statusBarHeight,
  },
  searchContainer: {
    backgroundColor: '#7b6be6',
    borderTopWidth: 0,
  },
  searchInput: {
    color: '#000',
    backgroundColor: '#eee',
  },
});

export default connect(({ auth }) => ({ auth }))(Home);
