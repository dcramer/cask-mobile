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

import { populateRelations } from '../utils/query';

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
    // this doesn't behave as expected and seems to break on various characters (like space)
    db.collection('bottles')
      .where('name', '>=', query)
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
            loading: false,
            items,
          });
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
      return (
        <AlertCard
          onPress={() => {
            this.props.navigation.navigate('AddBottle');
          }}
          heading="Can't find a bottle?"
          subheading={`Tap here to add ${this.props.query}.`}
        />
      );
    }

    if (this.state.loading && !this.state.items.length) {
      return <LoadingIndicator />;
    }

    if (this.props.query) {
      return (
        <View>
          <FlatList
            data={this.state.items}
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
    this.state = { searchActive: false, searchQuery: null };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SearchBar
            onFocus={() => this.setState({ searchActive: true })}
            onBlur={() => this.setState({ searchActive: false })}
            onChangeValue={searchQuery => this.setState({ searchQuery })}
            style={styles.searchBarContainer}
          />
        </View>
        <View style={styles.resultsContainer}>
          {this.state.searchActive || !!this.state.searchQuery ? (
            <SearchResults query={this.state.searchQuery} navigation={this.props.navigation} />
          ) : (
            <Activity
              auth={this.props.auth}
              navigation={this.props.navigation}
              queryset={db
                .collection('checkins')
                .where('user', '==', this.props.auth.user.uid)
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
